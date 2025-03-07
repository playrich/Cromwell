import { TPermissionName, TRole } from '@cromwell/core';
import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToMany } from 'typeorm';

import { BasePageEntity } from './base-page.entity';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Role extends BasePageEntity implements TRole {

    @Field(type => String)
    @Column({ type: "varchar", length: 255, nullable: true })
    name?: string | null;

    @Field(type => String, { nullable: true })
    @Column({ type: "varchar", length: 255, nullable: true })
    title?: string | null;

    @Field(type => [String], { nullable: true })
    @Column({ type: "simple-array", nullable: true })
    permissions: TPermissionName[] | null;

    @ManyToMany(() => User, user => user.roles, {
        cascade: true,
    })
    users?: User[] | null;
}
