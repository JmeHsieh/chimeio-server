# chimeio-server
A simple chat server using WebScokets <br />
(with [Feathersjs](https://github.com/feathersjs/feathers) micro-framework)


## Run

Getting up and running.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Make sure you have mongodb running on your machine.
3. Make sure you have Python 2 installed.
4. Install your dependencies:
    
    ```
    $ cd path/to/chimeio-server; npm install
    ```

5. Run `gulp` to build `src/` into `dist/` (transpile es6 with babel)

	```
	$ gulp
	```

6. Start your app
    
    ```
    $ npm start
    ```
7. Alternatively, you can just use `gulp watch` to make it rebuild + re-launch automatically (recommended)

	```
	$ gulp watch
	```

## Client App
- [iOS](https://github.com/JmeHsieh/Chime.IO-Client-Swift)

## License
[MIT license](LICENSE).
