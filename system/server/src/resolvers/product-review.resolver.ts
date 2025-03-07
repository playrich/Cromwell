import { GraphQLPaths, TPermissionName, TPagedList, TProductReview } from '@cromwell/core';
import {
    DeleteManyInput,
    PagedParamsInput,
    PagedProductReview,
    ProductReview,
    ProductReviewFilter,
    ProductReviewInput,
    ProductReviewRepository,
} from '@cromwell/core-backend';
import { Arg, Authorized, Int, Mutation, Query, Resolver } from 'type-graphql';
import { getCustomRepository } from 'typeorm';

import { resetAllPagesCache } from '../helpers/reset-page';
import { serverFireAction } from '../helpers/server-fire-action';

const getOneByIdPath = GraphQLPaths.ProductReview.getOneById;
const getManyPath = GraphQLPaths.ProductReview.getMany;
const createPath = GraphQLPaths.ProductReview.create;
const updatePath = GraphQLPaths.ProductReview.update;
const deletePath = GraphQLPaths.ProductReview.delete;
const deleteManyPath = GraphQLPaths.ProductReview.deleteMany;
const deleteManyFilteredPath = GraphQLPaths.ProductReview.deleteManyFiltered;
const getFilteredPath = GraphQLPaths.ProductReview.getFiltered;

@Resolver(ProductReview)
export class ProductReviewResolver {

    private repository = getCustomRepository(ProductReviewRepository)

    @Query(() => PagedProductReview)
    async [getManyPath](@Arg("pagedParams") pagedParams: PagedParamsInput<TProductReview>): Promise<TPagedList<TProductReview>> {
        return await this.repository.getProductReviews(pagedParams);
    }

    @Query(() => ProductReview)
    async [getOneByIdPath](@Arg("id", () => Int) id: number): Promise<ProductReview> {
        return await this.repository.getProductReview(id);
    }

    @Authorized<TPermissionName>('create_product_review')
    @Mutation(() => ProductReview)
    async [createPath](@Arg("data") data: ProductReviewInput): Promise<TProductReview> {
        const review = await this.repository.createProductReview(data);
        serverFireAction('create_product_review', review);
        return review;
    }

    @Authorized<TPermissionName>('update_product_review')
    @Mutation(() => ProductReview)
    async [updatePath](@Arg("id", () => Int) id: number, @Arg("data") data: ProductReviewInput): Promise<ProductReview> {
        const review = await this.repository.updateProductReview(id, data);
        serverFireAction('update_product_review', review);
        resetAllPagesCache();
        return review;
    }

    @Authorized<TPermissionName>('delete_product_review')
    @Mutation(() => Boolean)
    async [deletePath](@Arg("id", () => Int) id: number): Promise<boolean> {
        const review = await this.repository.deleteProductReview(id);
        serverFireAction('delete_product_review', { id });
        resetAllPagesCache();
        return review;
    }

    @Authorized<TPermissionName>('delete_product_review')
    @Mutation(() => Boolean)
    async [deleteManyPath](@Arg("data") data: DeleteManyInput): Promise<boolean | undefined> {
        const res = await this.repository.deleteMany(data);
        resetAllPagesCache();
        return res;
    }

    @Authorized<TPermissionName>('delete_product_review')
    @Mutation(() => Boolean)
    async [deleteManyFilteredPath](
        @Arg("input") input: DeleteManyInput,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductReviewFilter,
    ): Promise<boolean | undefined> {
        const res = await this.repository.deleteManyFilteredProductReviews(input, filterParams);
        resetAllPagesCache();
        return res;
    }

    @Query(() => PagedProductReview)
    async [getFilteredPath](
        @Arg("pagedParams", { nullable: true }) pagedParams?: PagedParamsInput<TProductReview>,
        @Arg("filterParams", { nullable: true }) filterParams?: ProductReviewFilter,
    ): Promise<TPagedList<TProductReview> | undefined> {
        return this.repository.getFilteredProductReviews(pagedParams, filterParams);
    }

}
