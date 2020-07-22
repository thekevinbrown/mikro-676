import { MikroORM } from '@mikro-orm/core';

import { Location } from './entities/location';
import { Organisation } from './entities/organisation';

const go = async () => {
	console.log('Running init');

	const start = +new Date();
	const orm = await MikroORM.init({
		type: 'postgresql',
		entities: [Location, Organisation],
		implicitTransactions: false,
		dbName: 'mikro_orm_test_gh_676',
	});
	const diff = +new Date() - start;
	console.log(`MikroORM.init() took ${diff / 1000} seconds.`);

	const generator = orm.getSchemaGenerator();
	const schema = await generator.getUpdateSchemaSQL(false);

	if (schema.length > 0) {
		console.log(`Need to run: ${schema}`);
		console.log('Executing...');
		await orm.em.getDriver().getConnection().execute(schema);
	}

	console.log('Adding new organisation...');
	const location = new Location();
	const organisation = new Organisation('Test', location);
	await orm.em.persistAndFlush(organisation);

	console.log('Counting Locations...');
	await orm.em.findAndCount(Location, {});

	console.log('Closing...');
	await orm.close();
};

go().catch(error => {
	console.error(error);
	process.exit(1);
});
