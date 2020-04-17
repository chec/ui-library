# Vue.js component UI library using Tailwindcss by Chec

[View the Storybook app](https://chec-ui.netlify.app/)
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
    // Example `tailwind.config.js` file

    module.exports = require('@chec/ui-library/tailwind.config');
    ```
2. Inject the `ui-library`'s compiled css and Tailwind.css file—which includes the @tailwind directives to include the `ui-library` configured Tailwindcss styles/utilities. 
    ```css
    /* example tailwind.css */

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

@import '~@chec/ui-library/src/assets/mixins.css';
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
