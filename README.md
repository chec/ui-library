# Vue.js component UI library using Tailwindcss by Chec

[View the Storybook app](https://chec-ui.netlify.app/)

## Licensing

Note that this project is not licensed intentionally. At the moment you will require explicit permission from Chec 
Platform Inc. to utilise this repo in your own projects. Please let us know if you're interested. hello@chec.io

In the future we may add a license. 

## Installation & Usage

You can use either `yarn` or `npm` to install the `ui-library` and it's dependencies from this Github repo.

### with yarn
```sh
yarn add github:chec/ui-library
```

### with npm
```sh
npm install github:chec/ui-library
```

### Setting up Tailwindcss 

1. Create a [`tailwind.config.js`](https://tailwindcss.com/docs/configuration/#app) file at the root of the app exporting the `ui-library`'s custom `tailwind.config.js` from it.

```js
module.exports = require('@chec/ui-library/tailwind.config');
```

2. Inject the `ui-library`'s compiled css and Tailwind.css file which includes the @tailwind directives to include the `ui-library` configured Tailwindcss styles/utilities. 

```css
/*
ui-library.css compiled css
*/
@import '~@chec/ui-library/dist/ui-library.css';

/*
tailwind.css, uses the @tailwind directive to inject Tailwind's base, components, and utilities styles into your CSS: 
*/  
@import '~@chec/ui-library/src/assets/tailwind.css';
```

### Utilizing Sass mixins

You can import helpful sass mixins such as `aspect-ratio`.

```scss
/* mixins.scss */

@import '~@chec/ui-library/src/assets/mixins.scss';
```

Mixins
- aspect-ratio

    use-case:
    ```html
    <div class="image-container">

      <img src="chec.io/image.jpg" />

      <div v-else>
        <h6>
          No Image
        </h6>
      </div>

    </div>
    ```
    
    ```scss
    .image-container {

      /* tailwind @apply directive */
      @apply w-1/2 max-w-sm; 

      /* apply aspect-ratio mixin */
      @include aspect-ratio(16, 9); 

      /* style fall-back element */
      div {
        @apply bg-gray-300;
      }
    }
    ```

### Translating

We use the `vue-i18n` library for this. See `lang/*.js` for the dictionaries. See the dashboard repo's
`lang/README.md` for a detailed guide for using the library. TL;DRs:

* `<p>{{ $t('paginate.goToFirst') }}</p>` renders "Go to the first page"
* `this.$t(...)` from component instance methods

## Project setup

```
git clone https://github.com/chec/ui-library.git
```

```
cd ui-library
```

```
yarn install
```

### Start Storybook app on port 6006:
```
yarn storybook:serve
```

### Run the frontend app proper on port 8080:
```
yarn run serve
```

### Compiles and minifies for production (This is done continously)
```
yarn build-lib
```

### Lints and fixes files
```
yarn lint:Fix
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
