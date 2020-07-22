# Mikro ORM Reproduction for #676

1. Clone
2. Run `yarn`
3. Create a database on your local Postgres called `mikro_orm_test_gh_676`.
4. Run `yarn start`

Expected Output:

```
yarn start
yarn run v1.22.4
$ yarn build && node dist/index
$ webpack --config webpack.config.js
Hash: f682753770a1775d9bd9
Version: webpack 4.43.0
Time: 6222ms
Built at: 07/22/2020 11:28:29 AM
                                    Asset       Size  Chunks             Chunk Names
        ../lib/src/entities/location.d.ts  291 bytes          [emitted]
    ../lib/src/entities/location.d.ts.map  353 bytes          [emitted]
    ../lib/src/entities/organisation.d.ts  355 bytes          [emitted]
../lib/src/entities/organisation.d.ts.map  421 bytes          [emitted]
                    ../lib/src/index.d.ts   46 bytes          [emitted]
                ../lib/src/index.d.ts.map  107 bytes          [emitted]
                                 index.js   2.61 MiB    main  [emitted]  main
Entrypoint main = index.js
[./node_modules/@mikro-orm/core/metadata sync recursive] ./node_modules/@mikro-orm/core/metadata sync 160 bytes {main} [built]
[./node_modules/@mikro-orm/core/utils sync recursive] ./node_modules/@mikro-orm/core/utils sync 160 bytes {main} [built]
[./node_modules/@mikro-orm/core/utils sync recursive ^.*\/package\.json$] ./node_modules/@mikro-orm/core/utils sync ^.*\/package\.json$ 160 bytes {main} [built]
[./src/entities/location.ts] 1.43 KiB {main} [built]
[./src/entities/organisation.ts] 1.84 KiB {main} [built]
[./src/index.ts] 1.36 KiB {main} [built]
[assert] external "assert" 42 bytes {main} [built]
[crypto] external "crypto" 42 bytes {main} [built]
[domain] external "domain" 42 bytes {main} [built]
[fs] external "fs" 42 bytes {main} [built]
[module] external "module" 42 bytes {main} [built]
[path] external "path" 42 bytes {main} [built]
[stream] external "stream" 42 bytes {main} [built]
[url] external "url" 42 bytes {main} [built]
[util] external "util" 42 bytes {main} [built]
    + 457 hidden modules

WARNING in ./node_modules/@mikro-orm/core/utils/ConfigurationLoader.js 56:29-50
Critical dependency: the request of a dependency is an expression
 @ ./node_modules/@mikro-orm/core/utils/index.js
 @ ./node_modules/@mikro-orm/core/index.js
 @ ./src/index.ts

WARNING in ./node_modules/@mikro-orm/core/metadata/JavaScriptMetadataProvider.js 48:27-40
Critical dependency: the request of a dependency is an expression
 @ ./node_modules/@mikro-orm/core/metadata/index.js
 @ ./node_modules/@mikro-orm/core/index.js
 @ ./src/index.ts

WARNING in ./node_modules/@mikro-orm/core/utils/Utils.js 360:16-34
require.extensions is not supported by webpack. Use a loader instead.
 @ ./node_modules/@mikro-orm/core/utils/index.js 16:13-31
 @ ./node_modules/@mikro-orm/core/index.js
 @ ./src/index.ts

WARNING in ./node_modules/@mikro-orm/core/utils/Utils.js 360:40-58
require.extensions is not supported by webpack. Use a loader instead.
 @ ./node_modules/@mikro-orm/core/utils/index.js 16:13-31
 @ ./node_modules/@mikro-orm/core/index.js
 @ ./src/index.ts
Running init
MikroORM.init() took 1.163 seconds.
Adding new organisation...
TypeError: Cannot read property '__meta' of undefined
    at new Reference (webpack:///./node_modules/@mikro-orm/core/entity/Reference.js?:10:17)
    at Function.create (webpack:///./node_modules/@mikro-orm/core/entity/Reference.js?:29:16)
    at Function.wrapReference (webpack:///./node_modules/@mikro-orm/core/utils/Utils.js?:409:39)
    at Organisation.set [as location] (webpack:///./node_modules/@mikro-orm/core/entity/EntityHelper.js?:99:56)
    at UnitOfWork.fixMissingReference (/Users/kevin/development/mikro-676/node_modules/@mikro-orm/core/unit-of-work/UnitOfWork.js:376:31)
    at UnitOfWork.cascadeReference (/Users/kevin/development/mikro-676/node_modules/@mikro-orm/core/unit-of-work/UnitOfWork.js:325:14)
    at UnitOfWork.cascade (/Users/kevin/development/mikro-676/node_modules/@mikro-orm/core/unit-of-work/UnitOfWork.js:321:18)
    at UnitOfWork.persist (/Users/kevin/development/mikro-676/node_modules/@mikro-orm/core/unit-of-work/UnitOfWork.js:110:14)
    at SqlEntityManager.persist (/Users/kevin/development/mikro-676/node_modules/@mikro-orm/core/EntityManager.js:307:34)
    at SqlEntityManager.persistAndFlush (/Users/kevin/development/mikro-676/node_modules/@mikro-orm/core/EntityManager.js:316:20)
error Command failed with exit code 1.
```

## Profiling

Because `MikroORM.init` is taking quite a while, I've added 0x to profile what's taking so long. It looks like about half the time in init is
spent in highlight.js, while the other half is spent getting a database connection, and the rest is not worth optimising because it's so small.

To run profiling locally after doing the steps above, run `yarn profile`. This should run then generate and open a flamegraph in your browser.

Expected Output:
