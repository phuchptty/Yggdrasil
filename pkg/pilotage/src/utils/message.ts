import { message } from 'antd';

export const showErr = (error: any) => {
    message.error(error?.graphQLErrors?.[0]?.message || 'Đã có lỗi xảy ra');
};
