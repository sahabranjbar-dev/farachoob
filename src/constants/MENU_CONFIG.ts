interface MenuConfig {
  title: string;
  href: string;
  icon?: string;
  permissions: {
    view: PermissionKey;
    create?: PermissionKey;
    edit?: PermissionKey;
    delete?: PermissionKey;
  };
  parent?: AppMenu;
}

export enum AppMenu {
  Blogs = "blogs",
  Brands = "brands",
  Categories = "categories",
  Comments = "comments",
  Menus = "menus",
  Permissions = "permissions",
  Products = "products",
  Roles = "roles",
  Users = "users",
  Setting = "setting",
}

export enum PermissionKey {
  // Blogs
  ViewBlogs = "view_blogs",
  CreateBlogs = "create_blogs",
  EditBlogs = "edit_blogs",
  DeleteBlogs = "delete_blogs",

  // Brands
  ViewBrands = "view_brands",
  CreateBrands = "create_brands",
  EditBrands = "edit_brands",
  DeleteBrands = "delete_brands",

  // Categories
  ViewCategories = "view_categories",
  CreateCategories = "create_categories",
  EditCategories = "edit_categories",
  DeleteCategories = "delete_categories",

  // Comments
  ViewComments = "view_comments",
  CreateComments = "create_comments",
  EditComments = "edit_comments",
  DeleteComments = "delete_comments",

  // Menus
  ViewMenus = "view_menus",
  CreateMenus = "create_menus",
  EditMenus = "edit_menus",
  DeleteMenus = "delete_menus",

  // Permissions
  ViewPermissions = "view_permissions",
  CreatePermissions = "create_permissions",
  EditPermissions = "edit_permissions",
  DeletePermissions = "delete_permissions",

  // Products
  ViewProducts = "view_products",
  CreateProducts = "create_products",
  EditProducts = "edit_products",
  DeleteProducts = "delete_products",

  // Roles
  ViewRoles = "view_roles",
  CreateRoles = "create_roles",
  EditRoles = "edit_roles",
  DeleteRoles = "delete_roles",

  // Users
  ViewUsers = "view_users",
  CreateUsers = "create_users",
  EditUsers = "edit_users",
  DeleteUsers = "delete_users",

  //Setting
  ViewSetting = "view_setting",
  CreateSetting = "create_setting",
  EditSetting = "edit_setting",
  DeleteSetting = "delete_setting",

  //Projects
  ViewProjects = "view_projects",
  CreateProjects = "create_projects",
  EditProjects = "edit_projects",
  DeleteProjects = "delete_projects",
}

export const MENU_CONFIG: Record<AppMenu, MenuConfig> = {
  [AppMenu.Blogs]: {
    href: "/blogs",
    title: "مقالات",
    icon: "Article",
    permissions: {
      view: PermissionKey.ViewBlogs,
      create: PermissionKey.CreateBlogs,
      edit: PermissionKey.EditBlogs,
      delete: PermissionKey.DeleteBlogs,
    },
  },
  [AppMenu.Brands]: {
    href: "/brands",
    title: "برندها",
    icon: "Brands",
    permissions: {
      view: PermissionKey.ViewBrands,
      create: PermissionKey.CreateBrands,
      edit: PermissionKey.EditBrands,
      delete: PermissionKey.DeleteBrands,
    },
  },
  [AppMenu.Categories]: {
    href: "/categories",
    title: "دسته‌بندی‌ها",
    icon: "Category",
    permissions: {
      view: PermissionKey.ViewCategories,
      create: PermissionKey.CreateCategories,
      edit: PermissionKey.EditCategories,
      delete: PermissionKey.DeleteCategories,
    },
  },
  [AppMenu.Comments]: {
    href: "/comments",
    title: "نظرات",
    icon: "Comments",
    permissions: {
      view: PermissionKey.ViewComments,
      create: PermissionKey.CreateComments,
      edit: PermissionKey.EditComments,
      delete: PermissionKey.DeleteComments,
    },
  },
  [AppMenu.Menus]: {
    href: "/menus",
    title: "منوها",
    icon: "Menu",
    permissions: {
      view: PermissionKey.ViewMenus,
      create: PermissionKey.CreateMenus,
      edit: PermissionKey.EditMenus,
      delete: PermissionKey.DeleteMenus,
    },
  },
  [AppMenu.Permissions]: {
    href: "/permissions",
    title: "مجوزها",
    icon: "Key",
    permissions: {
      view: PermissionKey.ViewPermissions,
      create: PermissionKey.CreatePermissions,
      edit: PermissionKey.EditPermissions,
      delete: PermissionKey.DeletePermissions,
    },
  },
  [AppMenu.Products]: {
    href: "/products",
    title: "محصولات",
    icon: "Product",
    permissions: {
      view: PermissionKey.ViewProducts,
      create: PermissionKey.CreateProducts,
      edit: PermissionKey.EditProducts,
      delete: PermissionKey.DeleteProducts,
    },
  },
  [AppMenu.Roles]: {
    href: "/roles",
    title: "نقش‌ها",
    icon: "Role",
    permissions: {
      view: PermissionKey.ViewRoles,
      create: PermissionKey.CreateRoles,
      edit: PermissionKey.EditRoles,
      delete: PermissionKey.DeleteRoles,
    },
  },
  [AppMenu.Users]: {
    href: "/users",
    title: "کاربران",
    icon: "User",
    permissions: {
      view: PermissionKey.ViewUsers,
      create: PermissionKey.CreateUsers,
      edit: PermissionKey.EditUsers,
      delete: PermissionKey.DeleteUsers,
    },
  },
  [AppMenu.Setting]: {
    href: "/setting",
    title: "تنظیمات کاربری",
    icon: "Settings",
    permissions: {
      view: PermissionKey.ViewSetting,
      create: PermissionKey.CreateSetting,
      edit: PermissionKey.EditSetting,
      delete: PermissionKey.DeleteSetting,
    },
  },
};
