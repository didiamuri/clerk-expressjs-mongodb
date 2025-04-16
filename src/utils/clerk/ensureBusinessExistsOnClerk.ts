import {clerkClient} from "@clerk/express";

export async function ensureBusinessExistsOnClerk(organizationId: string): Promise<boolean> {
    try {
        const organization = await clerkClient.organizations.getOrganization({ organizationId });
        return !!organization;
    } catch (err: any) {
        if (err.errors?.[0]?.code === 'resource_not_found') return false;
        throw err;
    }
}