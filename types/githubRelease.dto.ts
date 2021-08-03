export interface IGithubRelease {
    url: string;
    // eslint-disable-next-line camelcase
    html_url: string;
    // eslint-disable-next-line camelcase
    assets_url: string;
    // eslint-disable-next-line camelcase
    upload_url: string;
    // eslint-disable-next-line camelcase
    tarball_url: string;
    // eslint-disable-next-line camelcase
    zipball_url: string;
    id: number;
    // eslint-disable-next-line camelcase
    node_id: string;
    // eslint-disable-next-line camelcase
    tag_name: string;
    // eslint-disable-next-line camelcase
    target_commitish: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    // eslint-disable-next-line camelcase
    created_at: string;
    // eslint-disable-next-line camelcase
    published_at: string;
    author: IAuthor;
    assets?: IAssetsEntity[];
}

export interface IAuthor {
    login: string;
    id: number;
    // eslint-disable-next-line camelcase
    node_id: string;
    // eslint-disable-next-line camelcase
    avatar_url: string;
    // eslint-disable-next-line camelcase
    gravatar_id: string;
    url: string;
    // eslint-disable-next-line camelcase
    html_url: string;
    // eslint-disable-next-line camelcase
    followers_url: string;
    // eslint-disable-next-line camelcase
    following_url: string;
    // eslint-disable-next-line camelcase
    gists_url: string;
    // eslint-disable-next-line camelcase
    starred_url: string;
    // eslint-disable-next-line camelcase
    subscriptions_url: string;
    // eslint-disable-next-line camelcase
    organizations_url: string;
    // eslint-disable-next-line camelcase
    repos_url: string;
    // eslint-disable-next-line camelcase
    events_url: string;
    // eslint-disable-next-line camelcase
    received_events_url: string;
    type: string;
    // eslint-disable-next-line camelcase
    site_admin: boolean;
}

export interface IAssetsEntity {
    url: string;
    // eslint-disable-next-line camelcase
    browser_download_url: string;
    id: number;
    // eslint-disable-next-line camelcase
    node_id: string;
    name: string;
    label: string;
    state: string;
    // eslint-disable-next-line camelcase
    content_type: string;
    size: number;
    // eslint-disable-next-line camelcase
    download_count: number;
    // eslint-disable-next-line camelcase
    created_at: string;
    // eslint-disable-next-line camelcase
    updated_at: string;
    uploader: IAuthor;
}
