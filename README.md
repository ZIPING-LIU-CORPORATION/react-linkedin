
# LinkedIn Badge Rendering React Component

This is a React component that renders a LinkedIn badge on a website, allowing users to display their LinkedIn profile information or company details. It is an improved implementation of LinkedIn's provided code for embedding profile badges on a site.

## Features

- Renders LinkedIn badges with customizable options (locale, size, theme, type, vanity, version)
- Supports both profile badges and entity badges (e.g., company badges) **NOTE: USAGE OF THIS COMPANENT BY LINKEDIN EMPLOYEES IS PROHIBITED AND THUS MAY NOT BE USED, REFERENCED, OR USED AS INSPIRATION FOR ANY LINKEDIN EMPLOYEE UNLESS WITH THE EXPRESSED CONTRACTUAL AGREEMTN BY THE AUTHOR OF THIS SOFTWARE, PLEASE SEE LICENSE IN [LINKEDINLIU.LICENSE.md](LINKEDINLIU.LICENSE.md) FOR MORE INFORMATION**
- Separates badge container rendering from dynamic badge content rendering for better code organization
- Handles asynchronous loading of badge content from LinkedIn's servers
- Allows for easy management and rendering of as many badges as needed on a page given the containerized approach in rendering the badge
- Manages the lifecycle of script tags injected for badge rendering through a robust react state management system
- Provides a callback function to track when the badge has finished rendering
### Improvements Over LinkedIn's Implementation
This implementation improves upon LinkedIn's provided [implementation](https://platform.linkedin.com/badges/js/profile.js) in several notable ways that no longer undergo the same kind of common issues that can be seen when utilzing LinkedIn's basic javascript injection method.
- It provides more customization options, such as size, theme, type, and version.
- It supports multiple badges on the same page.
- It handles asynchronous loading of badge content from the server.
- It has a modular design with clear separation of concerns, making it easier to maintain and extend.

## Demo
Don't just take my word for it regarding the descriped improvements made. See the demo of this in action at [here](https://liu.zipihg.org/r/linkedinliu), in which you are clearly able to discern a measurable difference
in the now more robost and controllable rendering of the LinkedIn Badge compoared to the method provided by LinkedI from its own [instructions](https://www.linkedin.com/badges/profile/create?vanityname=%E2%98%AFliu&preferredlocale=en_US&trk=public_profile_badge&source=ziping.org).


### Note in legacy needs of the LinkedIn Badge
Version 4.0 or lower utilizes LinkedIn's [script](https://platform.linkedin.com/badges/js/profile.js) to render the badge. Thus, feel free to use version 4 or lower in case you require rendering via LinkedIn's method in any means. Version 4 by the means is a version that has issues or functionality flaws, and is a stable legacy version of the component. Version 5.0 given that it fully integrates rendering within the component and thus utilizes fully adherence toward React's lifecycle methods and state management system, provides even fuller abilities in allowing the badge to properly render and animate utilizing any other React component's or libraries within your project.




## Installation

To use this component in your React application, you can install it as an [npm](https://www.npmjs.com/package/react-linkedinbadge) or [yarn](https://yarnpkg.com/package/react-linkedinbadge)package or simply copy the source files into your project.

```bash
npm install react-linkedinbadge
```

```bash
yarn add react-linkedinbadge
```


### Example Usage
```tsx
import React from 'react';
import LinkedInBadge from 'react-linkedinbadge';

const App = () => {
  return (
	 <div>
		<LinkedInBadge
		  vanity="your-linkedin-vanity" // the vanity is the part of your LinkedIn profile URL that comes after the last forward slash, e.g. for https://www.linkedin.com/in/your-vanity, the vanity is `your-vanity`
		  style={{ width: '300px', height: '300px' }}
		  id="MyLinkedInBadge" // id is only required if you want to load more than one badge on the same page
		  size="large"
		  theme="light"
		  type="vertical"
		/>
	 </div>
  );
};
```

### CDN
You can also load this component via CDN by adding the following script tag to your HTML file:
```html
<script src="https://cdn.jsdelivr.net/npm/react-linkedinbadge@4/lib/linkedinbadge.min.js"></script>
```

You then can use it from the global scope, via the variable `LinkedInBadge` from your `window` object. Be sure to also load React and ReactDOM before using this component in your html file and thus before loading the `linkedinbadge.min.js` script. 

Full example:
```html
<html>

<head>
   <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
   <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/react-linkedinbadge@4/lib/linkedinbadge.min.js"></script>
</head>

<body>
   <div id="root"></div>

   <script async defer>
      console.log("HI")
      const LinkedInBadge = window.LinkedInBadge;
      console.info(LinkedInBadge)
      const Reactelem = React.createElement(LinkedInBadge, {
         type: "HORIZONTAL",
         size: "large",
         theme: "DARK",
         vanity: "☯liu",
      });
      const rootelem = document.getElementById('root');
      if (rootelem) {
         ReactDOM.render(Reactelem, rootelem);
      } 
   </script>
</body>

</html>
```


## How it Works

<details><summary>This implementation uses two React components: `LinkedInBadge` and `LIRenderAll`.
</summary>

 `LinkedInBadge` is the parent component responsible for rendering the container and basic structure of the LinkedIn badge, while `LIRenderAll` is a child component that handles the rendering and management of the actual badge content.

The reason for this separation is that the badge content needs to be loaded asynchronously from a server, and the `LIRenderAll` component is responsible for making the necessary requests and handling the responses. By separating the concerns, the parent component can render the initial structure, and the child component can take care of the dynamic badge content.
</details>

### `LinkedInBadge`

The `LinkedInBadge` component is the parent component responsible for rendering the container and basic structure of the LinkedIn badge. It accepts the props mentioned above and passes them down to the `LIRenderAll` child component. It also manages its own state related to component mounting and badge rendering.

### `LIRenderAll`

The `LIRenderAll` component is a child component that handles the rendering and management of the actual badge content. It is responsible for making requests to LinkedIn's servers to fetch the badge data and rendering the badge content within an `<iframe>` element.

The component uses various hooks and callbacks to manage the state and lifecycle of the badge rendering process. It keeps track of the number of expected and received responses from the server, handles the insertion of the badge content into the appropriate container, and manages the replacement of any script tags within the badge markup.

The separation of concerns between `LinkedInBadge` and `LIRenderAll` allows for a more modular and maintainable codebase, where the responsibilities of rendering the badge container and managing the dynamic badge content are clearly separated.

## Improvements over LinkedIn's Implementation

This implementation improves upon LinkedIn's provided code in the following ways:

1. **Separation of Concerns**: The code separates the rendering of the badge container (`LinkedInBadge`) from the rendering and management of the dynamic badge content (`LIRenderAll`). This separation makes the codebase more modular and maintainable.

2. **State Management**: The component uses React hooks to manage the state of badge rendering, script loading, and response handling, making the code more readable and easier to understand.

3. **Lifecycle Management**: The component hooks into the appropriate lifecycle methods to ensure proper rendering and cleanup of the badge and related scripts.

4. **Callback Function**: A callback function (`setBadgeDidRender`) is provided to track when the badge has finished rendering, allowing for additional actions or updates to be performed after the badge rendering is complete.

5. **Code Organization**: The code is organized into separate functions and components, with clear responsibilities and improved readability.

6. **JSDoc Comments**: Detailed JSDoc comments are provided for better understanding and documentation of the code.

7. **Prop Handling**: The component handles optional props and provides default values for missing props, improving flexibility and ease of use.

8. **Error Handling**: Improved error handling and validation are implemented throughout the code to ensure better reliability and robustness.

## Contributing

Contributions to this project are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the project's GitHub repository.

## License
See license in [LINKEDINLIU.LICENSE.md](LINKEDINLIU.LICENSE.md)

### Links
- [NPM Package](https://www.npmjs.com/package/react-linkedinbadge)
- [Yarn Package](https://yarnpkg.com/package/react-linkedinbadge)
- [GitHub Repository](https://github.com/ziping-liu-corporation/react-linkedin)
- [LinkedIn Badge Creation](https://www.linkedin.com/badges/profile/create?vanityname=%E2%98%AFliu&preferredlocale=en_US&trk=public_profile_badge&source=ziping.org)
- [JSDELIVR CDN](https://www.jsdelivr.com/package/npm/react-linkedinbadge)