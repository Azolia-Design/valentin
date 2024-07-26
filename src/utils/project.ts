import { getCollection } from 'astro:content';
import { cleanSlug, trimSlash, POST_PERMALINK_PATTERN } from './permalinks';

const generatePermalink = async ({
    id,
    slug,
    publishDate,
    }) => {
    const year = String(publishDate.getFullYear()).padStart(4, '0');
    const month = String(publishDate.getMonth() + 1).padStart(2, '0');
    const day = String(publishDate.getDate()).padStart(2, '0');
    const hour = String(publishDate.getHours()).padStart(2, '0');
    const minute = String(publishDate.getMinutes()).padStart(2, '0');
    const second = String(publishDate.getSeconds()).padStart(2, '0');
    const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
        .replace('%id%', id)
        .replace('%year%', year)
        .replace('%month%', month)
        .replace('%day%', day)
        .replace('%hour%', hour)
        .replace('%minute%', minute)
        .replace('%second%', second);
    console.log(slug)
    console.log(permalink)
    return permalink
        .split('/')
        .map((el) => trimSlash(el))
        .filter((el) => !!el)
        .join('/');
};

const getNormalizedPost = async (post) => {
    const { id, slug: rawSlug = '', data } = post;
    const { Content, remarkPluginFrontmatter } = await post.render();
    const {
        publishDate: rawPublishDate = new Date(),
        updateDate: rawUpdateDate,
        title,
        excerpt,
        image,
        author,
        draft = false,
        metadata = {},
    } = data;

    const slug = cleanSlug(rawSlug); // cleanSlug(rawSlug.split('/').pop());
    const publishDate = new Date(rawPublishDate);
    const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

    return {
        id: id,
        slug: slug,
        permalink: await generatePermalink({ id, slug, publishDate }),

        publishDate: publishDate,
        updateDate: updateDate,

        title: title,
        excerpt: excerpt,
        image: image,

        author: author,

        draft: draft,

        metadata,

        Content: Content,
        // or 'content' in case you consume from API

        readingTime: remarkPluginFrontmatter?.readingTime,
        };
};

const load = async function () {
    const posts = await getCollection('post');
    const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

    const results = (await Promise.all(normalizedPosts))
        .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
        .filter((post) => !post.draft);

    return results;
};

let _posts;

export const fetchPosts = async () => {
    if (!_posts) {
        _posts = await load();
    }

    return _posts;
};
export const getStaticPathsProjectPost = async () => {
    // if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
    return (await fetchPosts()).flatMap((post) => {
        console.log(post.permalink);
        return ({
            params: {
                page: post.permalink,
            },
            props: { post },
        })
    });
};