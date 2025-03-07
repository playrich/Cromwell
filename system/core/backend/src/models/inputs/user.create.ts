import { TCreateUser } from '@cromwell/core';
import { Field, InputType } from 'type-graphql';

import { BasePageInput } from './base-page.input';

@InputType()
export class CreateUser extends BasePageInput implements TCreateUser {

    @Field(() => String)
    fullName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field(() => String, { nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => String, { nullable: true })
    phone?: string;

    @Field(() => String, { nullable: true })
    bio?: string;

    @Field(() => [String], { nullable: true })
    roles?: string[];
}

