# yo lean:php-lib

> This generator is useful to generate new PHP libs with the same files
 used across other PHP libraries.

To run this command just type on the terminal: 

```bash
yo lean:php-lib
```

This command will ask for small things to set up the composer library in
order to make things easier to set up, (we can always update on the
future).

This generator creates: 

- A composer.json file
- A set of rules used for the codesniffer with some exceptions to allow PSR4 and namespaces.
- A default .gitignore file
- An .editorconfig file
- A .travis.yml file to set up CI.
- A licence file
