export type PermissionAction = "view" | "create" | "update" | "delete";

export interface Permission {
  feature: string;
  action: PermissionAction;
}

export function canAccess(
	permissions: Permission[],
	feature: string,
	action: PermissionAction
): boolean {
	return permissions.some((perm) => perm.feature === feature && perm.action === action);
}

export function filterTabs(
	permissions: Permission[],
	tabs: Array<{ href: string; feature: string }>
) {
	return tabs.filter((tab) => canAccess(permissions, tab.feature, "view"));
}
