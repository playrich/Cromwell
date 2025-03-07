import React from 'react';
import { ConnectionOptions } from 'typeorm';

import { ESharedComponentNames, systemPackages } from '../constants';
import { TCromwellBlock, TCromwellBlockData } from './blocks';
import {
    TCmsAdminSettings,
    TCmsEnabledModules,
    TCmsEntityCore,
    TCmsInternalSettings,
    TCmsPublicSettings,
    TCmsRedirect,
    TPost,
    TProduct,
    TServiceVersions,
    TUser,
} from './entities';

/**
 * Global store mostly for internal usage.
 * If you need Redux interactivity, use onStoreChange.
 */
export type TCromwellStore = {
    /**
     * Internal. Plugins data
     */
    plugins?: Record<string, {
        data?: any;
        component?: any;
        code?: string;
    }>;
    /**
     * Public CMS Settings 
     */
    cmsSettings?: TCmsSettings;
    /**
     * Config of currently opened Theme's page
     */
    pageConfig?: TPageConfig;
    themeCustomConfig?: Record<string, any>;

    /** 
     * See `defaultPages` in TThemeConfig
     */
    defaultPages?: Partial<Record<TDefaultPageName, string>>;

    /**
     * Internal. Shared component storage. E.g. product cards to be reused by Plugins
     *  { [ComponentName]: (Class/function) }
     *  */
    components?: TSharedComponents;

    /**
     * Internal. References to all instances of Cromwell Blocks at the page
     * { [CromwellBlockId]: Instance}
     */
    blockInstances?: Record<string, TCromwellBlock | undefined>;
    /**
     * Short pages info of current Theme
     */
    pagesInfo?: TPageInfo[];

    /**
     * Active currency
     */
    currency?: string;

    /**
     * Helper to invoke render (force update) of current page's root component
     */
    forceUpdatePage?: () => void;

    /**
     * Info about current DB for backend usage
     */
    dbInfo?: TDBInfo;

    environment?: {
        mode?: 'dev' | 'prod';
        isAdminPanel?: boolean;
    },
    /** Internal */
    apiClients?: {
        graphQLClient?: any;
        restAPIClient?: any;
    }
    webSocketClient?: any;
    cstore?: any;
    nodeModules?: TCromwellNodeModules;
    fsRequire?: (path: string) => Promise<any>;
    notifier?: TCromwellNotify;
    theme?: TCmsTheme;
    userInfo?: TUser;
    storeChangeCallbacks?: Record<string, Record<string, ((prop) => any)>>;
    /**
     * HTTP Redirects for Next.js server 
     */
    redirects?: Record<string, TCmsRedirect>;

    /**
     * HTTP rewrites for Next.js server
     */
    rewrites?: Record<string, TCmsRedirect>;

    /**
     * Custom components to inject by renderer into Theme
     */
    rendererComponents?: Partial<Record<'root' | 'pageWrapper', React.ComponentType>>;
}


declare global {
    namespace NodeJS {
        interface Global {
            CromwellStore: TCromwellStore;
        }
    }
    interface Window {
        CromwellStore: TCromwellStore;
    }
}

export type TDBEntity = keyof {
    Post;
    PostComment;
    Tag;
    Product;
    ProductVariant;
    ProductCategory;
    ProductReview;
    Attribute;
    Order;
    User;
    Role;
    Theme;
    Plugin;
    Generic;
    CMS;
    CustomEntity;
    Coupon;
}

export enum EDBEntity {
    Post = 'Post',
    PostComment = 'PostComment',
    Tag = 'Tag',
    Product = 'Product',
    ProductCategory = 'ProductCategory',
    ProductReview = 'ProductReview',
    Attribute = 'Attribute',
    Order = 'Order',
    User = 'User',
    Role = 'Role',
    Theme = 'Theme',
    Plugin = 'Plugin',
    Generic = 'Generic',
    CMS = 'CMS',
    CustomEntity = 'CustomEntity',
    Coupon = 'Coupon',
    ProductVariant = 'ProductVariant',
}

export type GraphQLPathsType = { [K in TDBEntity]: TGraphQLNode };

export type TGraphQLNode = {
    getOneById: string;
    getOneBySlug: string;
    getMany: string;
    getFiltered: string;
    create: string;
    update: string;
    delete: string;
    deleteMany: string;
    [x: string]: string;
}


export type TPagedList<Entity> = {
    pagedMeta?: TPagedMeta;
    elements?: Entity[];
}

export type TPagedParams<Entity> = {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: keyof Entity;
    order?: 'ASC' | 'DESC';
}

export type TPagedMeta = {
    pageNumber?: number;
    pageSize?: number;
    totalPages?: number;
    totalElements?: number;
}

/**
 * cmsconfig.json
 */
export type TCmsConfig = {
    domain?: string;
    url?: string;
    orm?: ConnectionOptions;
    apiUrl?: string;
    adminUrl?: string;
    frontendUrl?: string;
    centralServerUrl?: string;
    defaultSettings?: TCmsEntityCore;
    pm?: 'yarn' | 'cromwella';
    watchPoll?: number;
    useWatch?: boolean;
    env?: 'dev' | 'prod';
    accessTokenSecret?: string;
    refreshTokenSecret?: string;
    accessTokenExpirationTime?: number;
    refreshTokenExpirationTime?: number;
    cookieSecret?: string;
    serviceSecret?: string;
    redirects?: TCmsRedirect[];
    rewrites?: TCmsRedirect[];
    cmsInfo?: TCmsInfo;
    monolith?: boolean;
    modules?: TCmsEnabledModules;
};

/**
 * Merged info form cmsconfig.json and settings from DB
 */
export type TCmsSettings = TCmsConfig & TCmsPublicSettings & TCmsAdminSettings & TCmsInternalSettings;

export type TRollupConfig = {
    main: Record<string, any>;
    frontend?: Record<string, any>;
    frontendCjs?: Record<string, any>;
    backend?: Record<string, any>;
    themePages?: Record<string, any>;
    adminPanel?: Record<string, any>;
}

/**
 * Base config for Theme / Plugin in cromwell.config.js
 */
export type TBaseModuleConfig = {
    /** Configs for Rollup */
    rollupConfig?: () => TRollupConfig | Promise<TRollupConfig>;
}

/**
 * Theme module config, part of cromwell.config.js
 */
export type TThemeConfig = TBaseModuleConfig & {
    /** Next.js config that usually exported from next.config.js */
    nextConfig?: () => any;
    /** Colors to use */
    palette?: TPalette;
    /** Custom HTML to add into head of every page */
    headHtml?: string;
    /** Custom HTML to add to the end of every page */
    footerHtml?: string;
    /** Global CSS files to import from node_modules */
    globalCss?: string[];
    /** Mapping of default CMS pages to theme's components. Such as { category: "category/[slug]" } */
    defaultPages?: Record<TDefaultPageName, string>;
    /* Routes of generic pages. Default value: `[ { route: "pages/[slug]", name: "default" } ]` */
    genericPages?: {
        route: string;
        name: string
    }[];
    /** Pages' description and modifications */
    pages?: TPageConfig[];
    /** Custom config that will be available at every page in the Store inside pageConfig props */
    themeCustomConfig?: Record<string, any>;
    /** Modifications to apply on all pages */
    globalModifications?: TCromwellBlockData[];
}

/**
 * Plugin module config, part of cromwell.config.js
 */
export type TPluginConfig = TBaseModuleConfig & {
    adminInputFile?: string
    frontendInputFile?: string
    frontendModule?: string;
    backend?: string;
    defaultSettings?: any;
}

export type TModuleConfig = TThemeConfig & TPluginConfig;

export type TDefaultPageName = 'index' | 'category' | 'product' | 'post' | 'tag' | 'pages' | 'account' | 'checkout' | 'blog';

export type TPalette = {
    primaryColor?: string;
    secondaryColor?: string;
    mode?: 'light' | 'dark';
};

export type TPageInfo = {
    /** Unique ID of a page */
    id: string;

    /** 
     * Page's url/slug. Can be:
     * 1. Filesystem relative path of page's react component without extension. If file name is "./post/[slug].tsx"
     * then route must be "post/[slug]"
     * 2. Route of a virtual page (generic page). Responsible component is "pages/[slug].js" ,
     * route must in format: "pages/any-slug"
     * */
    route: string;

    /** Name */
    name: string;
    /** Meta title (SEO) */
    title?: string;
    /** Meta description (SEO) */
    description?: string;
    /** Meta keywords (SEO) */
    keywords?: string[];
    /** If true, this page created in PageBuilder or manually in config and does not have a corresponding source file with React component */
    isVirtual?: boolean;
    /** If page is generic and theme has multiple layouts specify route to responsible Next.js page */
    layoutRoute?: string;
}

export type TPageConfig = TPageInfo & {
    modifications: TCromwellBlockData[];
    pageCustomConfig?: Record<string, any>;
    /** Custom HTML to add into head of the page */
    headHtml?: string;
    /** Custom HTML to add to the end of the page */
    footerHtml?: string;
}

/**
 * Internal. Store for reusable Frontend dependencies.
 */
export type TCromwellNodeModules = {
    importStatuses?: Record<string, 'failed' | 'ready' | 'default' | Promise<'failed' | 'ready' | 'default'>>;
    scriptStatuses?: Record<string, 'failed' | 'ready' | Promise<'failed' | 'ready'>>;
    imports?: Record<string, () => void>;
    modules?: Record<string, any>;
    moduleExternals?: Record<string, string[]>;
    importModule?: (moduleName: string, namedExports?: string[]) => Promise<boolean> | boolean;
    importScriptExternals?: (metaInfo: TScriptMetaInfo) => Promise<boolean>;
    hasBeenExecuted?: boolean;
    prefix?: string;
    setPrefix?: (prefix: string) => void;
};

export type TScriptMetaInfo = {
    name: string;
    // { [moduleName]: namedImports }
    externalDependencies: Record<string, string[]>;
    import?: 'chunks' | 'lib';
}

export type TPagesMetaInfo = {
    paths: {
        pageName: string;
        localPath?: string;
        srcFullPath?: string;
        importedStyles?: string[];
        basePath?: string;
        localDepsBundle?: string;
    }[];
    basePath?: string;
    rootBuildDir?: string;
    buildDir?: string;
}

export type TFrontendBundle = {
    source?: string;
    meta?: TScriptMetaInfo;
    cjsPath?: string;
}

export type TPluginInfo = {
    name: string;
}

/**
 * UI Notification service. In Admin panel it's react-toastify, for example.
 */
export type TCromwellNotify<TOptions = any> = {
    success?: (message: string, options?: TOptions) => void;
    warning?: (message: string, options?: TOptions) => void;
    error?: (message: string, options?: TOptions) => void;
    info?: (message: string, options?: TOptions) => void;
}

/**
 * package.json definition with cromwell info
 */
export type TPackageJson = {
    name?: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    module?: string;
    cromwell?: TPackageCromwellConfig;
};

/**
 * Module info in package.json under "cromwell" property
 */
export type TPackageCromwellConfig = {
    name?: string;
    version?: string;
    type?: 'plugin' | 'theme';
    /** Minimal CMS version since when this module available to install */
    minCmsVersion?: string;
    title?: string;
    link?: string;
    author?: string;
    authorLink?: string;
    excerpt?: string;
    description?: string;
    icon?: string;
    image?: string;
    images?: string[];
    tags?: string[];
    packageName?: string;
    frontendDependencies?: (string | TFrontendDependency)[];
    themes?: string[];
    plugins?: string[];
    firstLoadedDependencies?: string[];
    bundledDependencies?: string[];
}

export type TCromwellaConfig = {
    packages: string[];
    frontendDependencies?: (string | TFrontendDependency)[];
}

export type TFrontendDependency = {
    name: string;
    version?: string;
    builtins?: string[];
    externals?: TExternal[];
    excludeExports?: string[];
    ignore?: string[];
    addExports?: TAdditionalExports[];
    bundledCss?: string[];
}

export type TExternal = {
    usedName: string;
    moduleName?: string;
    importName?: string;
}

export type TAdditionalExports = {
    name: string;
    path?: string;
    importType?: 'default' | 'named';
    saveAsModules?: string[];
}

export type TStoreListItem = {
    product?: TProduct;
    pickedAttributes?: Record<string, string[]>;
    amount?: number;
}

export type TCmsStats = {
    reviews: number;
    averageRating: number;
    pages: number;
    pageViews: number;
    topPageViews: TPageStats[];
    orders: number;
    salesValue: number;
    salesPerDay: TSalePerDay[];
    customers: number;
}

export type TPageStats = {
    pageId?: string;
    pageRoute?: string;
    pageName?: string;
    views?: number;
    slug?: string | null;
    entityType?: EDBEntity | string;
}

export type TSalePerDay = {
    date: Date;
    orders: number;
    salesValue: number;
}

export type TCmsStatus = {
    currentVersion?: string;
    updateAvailable: boolean;
    updateInfo?: TUpdateInfo;
    notifications?: TNotification[];
    isUpdating?: boolean;
}

export type TUpdateInfo = {
    name: string;
    version: string;
    packageVersion: string;
    beta: boolean;
    description?: string;
    changelog?: string;
    image?: string;
    createdAt: Date;
    onlyManualUpdate?: boolean;
}

export type TNotification = {
    message: string;
    type: 'info' | 'warning' | 'error';
    documentationLink?: string;
    pageLink?: string
}


/**
 * Version of a CMS module.
 * CCS - Cromwell Central Server
 */
export type TCCSVersion = {
    name: string;
    createdAt: Date;
    version: string;
    packageVersion: string;
    beta: boolean;
    onlyManualUpdate?: boolean;
    restartServices: (keyof TServiceVersions)[];
    description?: string;
    changelog?: string;
    image?: string;
}

export type TCCSModuleShortInfo = {
    version: string;
    packageVersion: string;
    betaVersion?: string;
    betaPackageVersion?: string;
}

export type TCCSModuleInfo = {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    packageName: string;
    version: string;
    packageVersion: string;
    betaVersion: string;
    betaPackageVersion: string;
    link?: string;
    author: string;
    authorLink?: string;
    slug?: string;
    title?: string;
    description?: string;
    excerpt?: string;
    image?: string;
    images?: string[];
    icon?: string;
    tags?: string[];
}


// PluginSettings
export type TPluginSettingsProps<TSettings = any> = {
    pluginSettings?: TSettings;
    pluginInfo?: TPackageCromwellConfig;
    pluginName: string;
}

export type TFrontendPluginProps<TData = any, TInstanceSettings = any> = {
    data?: TData;
    blockId?: string;
    pluginName: string;
    blockName: string;
    instanceSettings?: TInstanceSettings;
} & Record<string, any>;

export type TCmsTheme = {
    palette?: TPalette;
    mode?: 'default' | 'light' | 'dark';
}

export type TDBInfo = {
    dbType?: string;
}

export type TCmsInfo = {
    packages: Partial<Record<typeof systemPackages[number], string>>;
}

export type TSystemUsage = {
    osInfo: {
        arch: string;
        distro: string;
        platform: string;
    };
    cpuInfo: {
        manufacturer: string;
        brand: string;
        cores: number;
        speed: string;
    };
    cpuUsage: {
        previousLoads: {
            time: Date;
            load: number;
        }[];
        currentLoad: number;
        currentLoadIdle: number;
    };
    diskUsage: {
        size: number;
        available: number;
        used: number;
    };
    memoryUsage: {
        used: number
        available: number
        total: number
    }
}

export type TSharedComponents = Partial<{
    [ESharedComponentNames.ProductCard]: React.ComponentType<{
        product: TPost;
    }>;
    [ESharedComponentNames.PostCard]: React.ComponentType<{
        post: TProduct;
    }>;
}>


export type TPermissionName =
    'all'
    // Plugin
    | 'read_plugins'
    | 'install_plugin'
    | 'update_plugin'
    | 'uninstall_plugin'
    | 'activate_plugin'
    | 'read_plugin_settings'
    | 'update_plugin_settings'
    // Theme
    | 'read_themes'
    | 'install_theme'
    | 'update_theme'
    | 'uninstall_theme'
    | 'change_theme'
    | 'activate_theme'
    | 'read_theme_settings'
    | 'update_theme_settings'
    // Post
    | 'read_posts'
    | 'read_post_drafts'
    | 'create_post'
    | 'update_post'
    | 'delete_post'
    // Tag
    | 'read_tags'
    | 'create_tag'
    | 'update_tag'
    | 'delete_tag'
    // Comment
    | 'read_post_comments'
    | 'create_post_comment'
    | 'update_post_comment'
    | 'delete_post_comment'
    // Product
    | 'read_products'
    | 'create_product'
    | 'update_product'
    | 'delete_product'
    // Product category
    | 'read_product_categories'
    | 'create_product_category'
    | 'update_product_category'
    | 'delete_product_category'
    // Attribute
    | 'read_attributes'
    | 'create_attribute'
    | 'update_attribute'
    | 'delete_attribute'
    // Order
    | 'read_orders'
    | 'read_my_orders'
    | 'create_order'
    | 'update_order'
    | 'delete_order'
    // Product review
    | 'read_product_reviews'
    | 'create_product_review'
    | 'update_product_review'
    | 'delete_product_review'
    // User
    | 'read_users'
    | 'read_my_user'
    | 'create_user'
    | 'update_user'
    | 'update_my_user'
    | 'delete_user'
    // Role
    | 'read_roles'
    | 'read_permissions'
    | 'create_role'
    | 'update_role'
    | 'delete_role'
    // Custom entity
    | 'read_custom_entities'
    | 'create_custom_entity'
    | 'update_custom_entity'
    | 'delete_custom_entity'
    // Coupon
    | 'read_coupons'
    | 'create_coupon'
    | 'update_coupon'
    | 'delete_coupon'
    // CMS settings
    | 'read_cms_settings'
    | 'update_cms_settings'
    | 'update_cms'
    | 'export_db'
    | 'import_db'
    | 'read_public_directories'
    | 'create_public_directory'
    | 'remove_public_directory'
    | 'upload_file'
    | 'download_file'
    | 'delete_file'
    | 'read_cms_statistics'
    | 'read_cms_status'
    | 'read_system_info';
