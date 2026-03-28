import { EXTRACT_SAFE_USER_SELECT_OPTIONS } from "../lib/constants";
import { User } from "../models/user.model";
import { filtersSchema } from "../schemas/filter";
import { error, success } from "../utils/api-response";
import { async_handler } from "../utils/async-handler";


/**
 * @access      PROCETED<admin>
 * @description Get all users
 */

export const allUsers = async_handler(async (req, res) => {
    const result = filtersSchema.safeParse(req.query);

    if (!result.success) 
    return error(res, "Invalid query filters", 400, result.error.issues.map((issue) => issue.message));

    const filters: Record<string, string> = {};
    
    if (result.data.name) filters.name = result.data.name;
    if (result.data.email) filters.email = result.data.email;
    if (result.data.role) filters.role = result.data.role;

    const filteredUsers = await User.find(filters).select(EXTRACT_SAFE_USER_SELECT_OPTIONS);

    return success(res, "Success", 200, filteredUsers);
});

