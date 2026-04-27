import { registerBlockType } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import icons from './icon';

wp.blocks.updateCategory("ovation-sliders", { icon: icons.slider });

const fetchAllPosts = async () => {
    let allPosts = [];
    let page = 1;
    let morePostsAvailable = true;

    while (morePostsAvailable) {
        const posts = await apiFetch({ path: `/wp/v2/ova_elems?per_page=100&page=${page}` });
        allPosts = [...allPosts, ...posts];
        morePostsAvailable = posts.length === 100;
        page++;
    }

    return allPosts;
};

registerBlockType('ova-elems/ovation-sliders', {
    title: 'Ovation Sliders',
    icon: icons.slider,
    category: 'Ovation Sliders',
    attributes: {
        selectedPost: {
            type: 'number',
            default: null,
        }
    },
    edit: ({ attributes, setAttributes }) => {
        const { selectedPost } = attributes;
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            fetchAllPosts()
                .then((fetchedPosts) => {
                    setPosts(fetchedPosts);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }, []);

        const postOptions = posts.map(post => ({
            label: post.title.rendered,
            value: post.id,
        }));

        postOptions.unshift({ label: 'Select a post', value: null });

        return (
            <div>
                {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <SelectControl
                        label="Select a Post"
                        value={selectedPost}
                        options={postOptions}
                        onChange={(newPost) => setAttributes({ selectedPost: parseInt(newPost, 10) })}
                    />
                )}
            </div>
        );
    },
    save: ({ attributes }) => {
        return null;
    }
});
