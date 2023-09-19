import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginateModel, Types } from "mongoose";
import { Workspace, WorkspaceDocument } from "./schema/workspace.schema";
import { WorkspaceInput, WorkspaceUpdateInput } from "./dto/workspace.input";
import { LanguageService } from "../language/language.service";
import { GraphQLError } from "graphql/error";
import languageStartFile from "../../constants/languageStartFile.constant";
import { WorkspaceFileInput } from "../../commons/dto/workspaceFile.input";
import { SaveWorkspaceFileInput } from "./dto/workspaceFile.input";
import { mergeArrays, filterPreProcess } from "../../utils";
import { WorkspaceFile } from "../../commons/schemas/workspaceFile.schema";
import { WorkspacePermission, WorkspaceStatus } from "../../commons/enums";
import { PaginateInput } from "../../commons/dto/paginateInfo.input";

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectModel(Workspace.name) private wsModel: PaginateModel<WorkspaceDocument>,
        private readonly languageService: LanguageService,
    ) {}

    async findAll(): Promise<WorkspaceDocument[]> {
        return this.wsModel.find().populate(["workspaceLanguage"]).exec();
    }

    async findOneById(id: string): Promise<WorkspaceDocument> {
        return this.wsModel.findById(id).populate(["workspaceLanguage"]).exec();
    }

    async findOneByIdUser(owner: string, id: string): Promise<WorkspaceDocument> {
        return this.wsModel
            .findOne({
                _id: id,
                owner: {
                    _id: owner,
                },
            })
            .populate(["workspaceLanguage"])
            .exec();
    }

    async findAllByUser(owner: string, options: PaginateInput) {
        let query = {};

        if (options?.search) {
            query = {
                $text: {
                    $search: options?.search,
                },
            };
        } else if (options?.fields) {
            query = {
                _id: options?.fields?.id.map((x) => x),
            };
        }

        if (options?.filter) {
            query = {
                ...query,
                ...filterPreProcess(options?.filter),
            };
        }

        // Add owner
        query = {
            ...query,
            owner: {
                _id: owner,
            },
        };

        try {
            return this.wsModel.paginate(query, {
                page: options?.page || 1,
                limit: options?.perPage || 20,
                sort: options?.sort || {},
                populate: ["workspaceLanguage"],
            });
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    async findAllPublicWorkspace(options: PaginateInput) {
        let query = {};

        if (options?.search) {
            query = {
                $text: {
                    $search: options?.search,
                },
            };
        } else if (options?.fields) {
            query = {
                _id: options?.fields?.id.map((x) => x),
            };
        }

        if (options?.filter) {
            query = {
                ...query,
                ...filterPreProcess(options?.filter),
            };
        }

        // Add filter public
        query = {
            ...query,
            status: WorkspaceStatus.PUBLISHED,
            permission: WorkspacePermission.PUBLIC,
        };

        try {
            return this.wsModel.paginate(query, {
                page: options?.page || 1,
                limit: options?.perPage || 20,
                sort: options?.sort || {},
                populate: ["workspaceLanguage"],
            });
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    async findOneBySlug(owner: string, slug: string): Promise<WorkspaceDocument> {
        const doc = await this.wsModel
            .findOne({
                slug,
            })
            .populate(["workspaceLanguage"])
            .exec();

        if (!doc) {
            throw new GraphQLError("Không tìm thấy workspace!");
        }

        // If workspace is not published and not public -> check ownership
        if (doc.status === WorkspaceStatus.PUBLISHED && doc.permission === WorkspacePermission.PUBLIC) {
            return doc;
        } else {
            if (doc.owner._id.toString() !== owner) {
                throw new GraphQLError("Bạn không có quyền truy cập workspace này!");
            }

            return doc;
        }
    }

    async create(owner: string, ws: WorkspaceInput) {
        try {
            // Query language
            const language = await this.languageService.findOneById(ws.workspaceLanguage);

            if (!language) {
                throw new GraphQLError("Language not found");
            }

            // Generate workspace id
            const workspaceId = new Types.ObjectId();

            // Get language specific start file
            const { name: startFileName, mimeType } = languageStartFile[language.key];

            // Construct playground path
            const workspaceStorageBasePath = `workspaceFiles/${workspaceId}`;

            // Create starter file
            // const fileStat = await this.externalFileSystem.createBlankFile(workspaceStorageBasePath, startFileName, mimeType);

            // Save to DB
            const workspaceFile: WorkspaceFileInput = {
                name: startFileName,
                path: startFileName,
                s3Path: `${workspaceStorageBasePath}/${startFileName}`,
                // metadata: {
                    // fileSize: fileStat.size,
                    // mimeType: fileStat.metaData["content-type"],
                    // etag: fileStat.etag,
                    // lastModified: fileStat.lastModified,
                // },
            };

            const wsInstance = new this.wsModel({
                _id: workspaceId,
                owner: {
                    _id: owner,
                },
                workspaceFiles: [workspaceFile],
                ...ws,
            });

            return wsInstance.save().then((t) => t.populate(["workspaceLanguage"]));
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    async update(owner: string, id: string, ws: WorkspaceUpdateInput) {
        return this.wsModel
            .findOneAndUpdate(
                {
                    _id: id,
                    owner: {
                        _id: owner,
                    },
                },
                {
                    $set: {
                        ...ws,
                        status: WorkspaceStatus.PUBLISHED,
                    },
                },
                { new: true },
            )
            .populate(["workspaceLanguage"])
            .exec();
    }

    async delete(owner: string, id: string) {
        return this.wsModel
            .findOneAndDelete({
                _id: id,
                owner: {
                    _id: owner,
                },
            })
            .exec();
    }

    async countPublicWorkspaceByLanguages() {
        const doc = await this.wsModel
            .aggregate([
                {
                    $match: {
                        status: WorkspaceStatus.PUBLISHED,
                        permission: WorkspacePermission.PUBLIC,
                    },
                },
                {
                    $group: {
                        _id: "$workspaceLanguage",
                        count: { $sum: 1 },
                    },
                },
            ])
            .exec();

        return doc.map((x) => {
            return {
                languageId: x._id,
                count: x.count,
            };
        });
    }

    async saveWorkspaceFile(owner: string, id: string, workSpaceFiles: SaveWorkspaceFileInput[]) {
        try {
            // Query workspace
            const workspace = await this.findOneByIdUser(owner, id);

            if (!workspace) {
                throw new GraphQLError("Không tìm thấy workspace hoặc bạn không có quyền truy cập workspace này!");
            }

            const workspaceStorageBasePath = `workspaceFiles/${workspace._id}`;

            // TODO: Filter files is not string

            const files = await Promise.all(
                workSpaceFiles.map(async (file) => {
                    const { name, path, content, _id } = file;

                    const bufferContent = Buffer.from(content);

                    // const fileStat = await this.externalFileSystem.saveFile(workspaceStorageBasePath, path, bufferContent);

                    return {
                        _id,
                        name,
                        path,
                        s3Path: `${workspaceStorageBasePath}/${path}`,
                        // metadata: {
                        //     fileSize: fileStat.size,
                        //     mimeType: fileStat.metaData["content-type"],
                        //     etag: fileStat.etag,
                        //     lastModified: fileStat.lastModified,
                        // },
                    };
                }),
            );

            // Merge 2 object
            workspace.workspaceFiles = mergeArrays(workspace.workspaceFiles, files) as WorkspaceFile[];

            return workspace.save().then((t) => t.populate(["workspaceLanguage"]));
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    async deleteWorkspaceFile(owner: string, id: string, filePath: string) {
        try {
            // Query workspace
            const workspace = await this.findOneByIdUser(owner, id);

            if (!workspace) {
                throw new GraphQLError("Không tìm thấy workspace hoặc bạn không có quyền truy cập workspace này!");
            }

            const workspaceStorageBasePath = `workspaceFiles/${workspace._id}`;

            // Remove file from minio
            // await this.externalFileSystem.deleteFile(workspaceStorageBasePath, filePath);

            // Update db
            workspace.workspaceFiles = workspace.workspaceFiles.filter((file) => file.path !== filePath);

            return workspace.save().then((t) => t.populate(["workspaceLanguage"]));
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    // File system

    async getScatteredWorkspaceFile(owner: string, workspaceId: string, filePath: string) {
        try {
            // Query workspace
            const workspace = await this.findOneById(workspaceId);

            if (!workspace) {
                throw new GraphQLError("Không tìm thấy workspace");
            }

            // If workspace is not published and not public -> check ownership
            if ((workspace.status !== WorkspaceStatus.PUBLISHED || workspace.permission !== WorkspacePermission.PUBLIC) && workspace.owner._id.toString() !== owner) {
                throw new GraphQLError("Bạn không có quyền truy cập workspace này!");
            }

            // check in workspace files
            const workspaceFile = workspace.workspaceFiles.find((file) => file.path === filePath);

            if (!workspaceFile) {
                throw new GraphQLError(`Không tìm thấy file ${filePath} trong workspace!`);
            }

            const workspaceStoragePath = workspaceFile.s3Path || `workspaceFiles/${workspace._id}/${filePath}`;

            // Get file
            // const fileStat = await this.externalFileSystem.getFile(workspaceStoragePath);

            return {
                _id: workspaceFile._id,
                name: filePath.split("/").pop(),
                path: filePath,
                // ...fileStat,
            };
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    async getScatteredWorkspaceFiles(owner: string, workspaceId: string, filePaths: string[]) {
        try {
            const promises = filePaths.map((filePath) => this.getScatteredWorkspaceFile(owner, workspaceId, filePath));

            return await Promise.all(promises);
        } catch (e) {
            throw new GraphQLError(e);
        }
    }

    async generateUploadPreSignedUrl(workspaceId: string, filePaths: string) {
        try {
            const workspaceStorageBasePath = `workspaceFiles/${workspaceId}`;

            // return this.externalFileSystem.generatePreSignedUrl(workspaceStorageBasePath, filePaths);
        } catch (e) {
            throw new GraphQLError(e);
        }
    }
}