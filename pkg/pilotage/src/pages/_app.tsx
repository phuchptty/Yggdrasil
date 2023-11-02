// Styles
import "@/styles/reset.css";
import "@/styles/global.scss";
import "@/styles/atomics.scss";
import "@/styles/main.scss";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import LoadingPage from "@/components/loadingPage";
import { ReduxProviders } from "@/stores/provider";
import FetchMeProvider from "@/components/providers/FetchMeProvider";
import apolloClient from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";

import dayjs from "dayjs";
import "dayjs/locale/vi";
import { MittProvider } from "@/lib/mitt";

dayjs.locale("vi");

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const inter = Inter({ subsets: ["vietnamese"] });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <>
            <SessionProvider session={session}>
                <ReduxProviders>
                    <ApolloProvider client={apolloClient}>
                        <FetchMeProvider>
                            <ConfigProvider theme={theme}>
                                <MittProvider>
                                    <div className={inter.className}>

                                        <LoadingPage />
                                        {getLayout(<Component {...pageProps} />)}
                                    </div>
                                </MittProvider>
                            </ConfigProvider>
                        </FetchMeProvider>
                    </ApolloProvider>
                </ReduxProviders>
            </SessionProvider>
        </>
    );
}
