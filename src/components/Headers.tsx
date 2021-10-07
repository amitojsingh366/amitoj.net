import { FC } from "react";
import Head from "next/head";

export type HeaderProps = {
    title?: string,
    des?: string,
    image?: string,
    url?: string
}

export const Headers: FC<HeaderProps> = ({ title, des, image, url }) => {
    return (
        <Head>
            {title ?
                <title>{title}</title>
                : null}
            {title ?
                <meta property="og:title" content={title} key="title" />
                : null}
            {des ?
                <meta property="og:description" content={des} key="description" />
                : null}
            {image ?
                <meta property="og:image" content={image} key="image" />
                : null}
            {image ?
                <meta property="og:url" content={url} key="url" />
                : null}
        </Head>
    )
}