import {SortOrder} from "mongoose";

export type PostsRequest = {
    pageNumber?: number | undefined,
    pageSize?: number | undefined,
    sortBy?: string | undefined,
    sortDirection?: SortOrder
}

export type BlogsRequestWithoutSNT = {
    pageNumber?: number | undefined,
    pageSize?: number | undefined,
    sizePage?: string | undefined,
    sortBy?: string | undefined,
    sortDirection?: SortOrder
}

export type CommentsRequest = {
    pageNumber?: number | undefined,
    pageSize?: number | undefined,
    sortBy?: string | undefined,
    sortDirection?: SortOrder
}

export type BlogsRequest = {
    pageNumber?: number | undefined,
    pageSize?: number | undefined,
    sortBy?: string | undefined,
    searchNameTerm?: string | undefined,
    sortDirection?: SortOrder
}

export type UsersRequest = {
    sortBy?: string | undefined,
    sortDirection?: SortOrder,
    pageNumber?: number | undefined,
    pageSize?: number | undefined,
    searchLoginTerm?: string | undefined,
    searchEmailTerm?: string | undefined,
}
