import { AbstractDefaultDBCrudStrategy } from "../../db/abstractDefaultDBCrudStrategy";
import { UserDBSchema } from "./templateDBSchema";

class UserDBStrategy extends AbstractDefaultDBCrudStrategy<UserDBSchema>
{
    private static collectionName = "user";

    public getCollectionName(): string {
        return UserDBStrategy.collectionName;
    }
}

export { UserDBStrategy };