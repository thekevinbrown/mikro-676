import {
	Entity,
	PrimaryKey,
	BigIntType,
	Property,
	OneToOne,
	IdentifiedReference,
	Reference,
	BaseEntity,
} from '@mikro-orm/core';
import { Location } from './location';

@Entity({ tableName: 'organisation' })
export class Organisation extends BaseEntity<Organisation, 'id'> {
	@PrimaryKey({ type: BigIntType })
	id!: string;

	@OneToOne(() => Location, location => location.organisation, {
		wrappedReference: true,
		orphanRemoval: true,
	})
	location!: IdentifiedReference<Location>;

	@Property({ type: 'string' })
	name!: string;

	constructor(name: string, location: Location) {
		super();
		this.name = name;
		this.location = Reference.create(location);
	}
}
