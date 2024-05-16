# LinkedIn Badges with React

This React custom component lets you display LinkedIn profile information or company details in your React-based web application through LinkedIn Profile Badges. It is an enhanced version of the code provided by LinkedIn for embedding profile badges on any website, rendering badges much faster and more controlled than the provided method.

<a href='https://linkedinliu.com' target="_blank" 
	   title="LinkedIn Badges Displayed on its demo site at www.linkedinliu.com"
	   rel="noopener noreferrer" >
<image src='https://repository-images.githubusercontent.com/538215522/a957e0ed-4a77-4659-93f0-36aac5181d9c' alt='LinkedIn Badges Displayed on the Demo Site at linkedinliu.com' width='95%' height='auto' style="text-align:center;margin: 0 auto; align-self:center; max-width: 95%; height: auto;" />
</a>

## FEATURES

This component can render LinkedIn badges with customizable options such as locale, size, theme, type, vanity, and version. Due to limitations in LinkedIn's official badge rendering method, it now offers even more previously unavailable options. These additional options can be specific as part of the component's props.

- Supports both profile badges and entity badges (e.g., company badges), as well as badges that can be configured beyond the current options provided by LinkedIn's implementation.
- Separates badge container rendering from dynamic badge content rendering for better code organization and allows for asynchronous and non-blocking rendering of multiple badges due to the nature of LinkedIn's own method having utilized a global param in handling the rendering of multiple badges, which does not take into count how some badges may not appear on the page the same time as others (thus such badges would then miss the global train for rending).
- LinkedIn employees are not allowed to use this component. Without the author's contractual agreement, it should not be referenced or used as inspiration.
  _For complete details, do review the [license](/LICENSE.md) which explicilty provides detailed terms regarding the disallowance of usage with this component by any means in any assocations from commercial and/or for-profit entities._

## DEMO

Don't just take my word for it regarding the descriped improvements made. See the demo of this in action, viewable <a href="https://liu.ziping.org/r/linkedinliu">here</a>.

- See a measurable difference in the now more robost, efficient, and controlled rendering of the LinkedIn Badge compared to LinkedIn's method based on its official [instructions](https://www.linkedin.com/badges/profile/create?vanityname=%E2%98%AFliu&preferredlocale=en_US&trk=public_profile_badge&source=ziping.org).

## Utilizing Linkedin's methods instead with this Component

Version _4.0_ or lower utilizes LinkedIn's [script](https://platform.linkedin.com/badges/js/profile.js) to render the badge. I recommend using version 4 or lower in case you require rendering via LinkedIn's method by any means. Version 4, by the means, is a version that has issues or functionality flaws and is a stable legacy version of the component. Version 5.0, given that it fully integrates rendering within the component and thus utilizes full adherence toward React's lifecycle methods and state management system, provides even fuller abilities in allowing the badge to properly render and animate utilizing any other React components or libraries within your project.

For more details on the different versions that are maintained and supported, which render the profile badges in different forms, please see the [SECURITY.md](SECURITY.md)

## Installation

To use this component in your React application, you can install it as a&nbsp;<a href="https://www.npmjs.com/package/react-linkedinbadge">NPM</a>, or <a href="https://yarnpkg.com/package/react-linkedinbadge">yarn</a> package.

```bash
npm install react-linkedinbadge
```

```sql
yarn add react-linkedinbadge
```

### Example Usage

```jsx
import React from 'react';
import LinkedInBadge, {LinkedInBadgeProps} from 'react-linkedinbadge';
/*
 * Import the react-linkedinbadge stylesheet so that the badge is styled correctly
 * This is required as the badge is now rendered fully within the React component
 * and not through a server-side script. To utilize the server-side method, set the
 * `useLinkedInApiUrlPure` prop to `true` when using the `LinkedInBadge` component.
 */
import 'react-linkedinbadge/src/LinkedInBadge.css';
/*
 * Note: in case this stylesheet causes conflicts with your existing styles, use 'react-linkedinbadge/src/style.css' instead, which is a barebones stylesheet that only contains style definitions used for profile badge elements. Do to the barebones nature of this stylesheet, Some additional styling may be needed to ensure the badge is displayed correctly. The demo site utilizes style.css to stylize the React LinkedIn profile badges.
 */


const App = () => {
  const LinkedInBadgeProps: LinkedInBadgeProps = {
   /**
      * The vanity is the part of your LinkedIn profile URL that
      * comes after the last forward slash,
      * e.g. for https://www.linkedin.com/in/your-vanity,
      * the vanity is `your-vanity`
      */
    vanity: "your-linkedin-vanity",
    size: "large",
    theme: "light",
    type: "vertical",
  };
  return (
	 <div>
		<LinkedInBadge {...LinkedInBadgeProps}/>
	 </div>
  );
};
```

### CDN Usage

You can also load this component via CDN through [jsdelivr](https://www.jsdelivr.com/package/npm/react-linkedinbadge) by adding the following script tag to your HTML file:

```html
<script src="https://cdn.jsdelivr.net/npm/react-linkedinbadge"></script>
```

You then can use it from the global scope, via the variable `LinkedInBadge` from your `window` object. Be sure to also load React and ReactDOM before using this component in your html file and thus before loading the `linkedinbadge.min.js` script.

Full example:

```fortran
<html>

<head>
   <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
   <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/react-linkedinbadge"></script>
   <link href="https://cdn.jsdelivr.net/npm/react-linkedinbadge/src/style.min.css" rel="stylesheet" />
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
         theme: "dark",
         vanity: "☯liu"
      });
      const rootelem = document.getElementById('root');
      if (rootelem) {
         ReactDOM.render(Reactelem, rootelem);
      }
   </script>
</body>

</html>
```

## Architecture and Implementation

<details><summary>This implementation uses two React components: `LinkedInBadge` and `LIRenderAll`.
</summary>

`LinkedInBadge` is the parent component responsible for rendering the container and basic structure of the LinkedIn badge, while `LIRenderAll` is a child component that handles the rendering and management of the actual badge content.

The reason for this separation is that the badge content needs to be loaded asynchronously from a server, and the `LIRenderAll` component is responsible for making the necessary requests and handling the responses. By separating the concerns, the parent component can render the initial structure, and the child component can take care of the dynamic badge content.

### `LinkedInBadge`

The `LinkedInBadge` component is the parent component responsible for rendering the container and basic structure of the LinkedIn badge. It accepts the props mentioned above and passes them down to the `LIRenderAll` child component. It also manages its own state related to component mounting and badge rendering.

### `LIRenderAll`

The `LIRenderAll` component is a child component that handles the rendering and management of the actual badge content. It is responsible for making requests to LinkedIn's servers to fetch the badge data and rendering the badge content within an `<iframe>` element.

The component uses various hooks and callbacks to manage the state and lifecycle of the badge rendering process. It keeps track of the number of expected and received responses from the server, handles the insertion of the badge content into the appropriate container, and manages the replacement of any script tags within the badge markup.

The separation of concerns between `LinkedInBadge` and `LIRenderAll` allows for a more modular and maintainable codebase, where the responsibilities of rendering the badge container and managing the dynamic badge content are clearly separated.

Note, with versions 5.11 and above, by default, `LIRenderAll` is not used to render the badge content. The badge content is fully rendered on the client-side and within the `LinkedInBadge` component itself. This allows for better control and management of the badge rendering process, as well as improved performance and reliability.
To use the `LIRenderAll` component, set the `useLinkedInApiUrlPure` prop to `true` when using `LinkedInBadge` component.

</details>

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

See license in [LICENSE.md](LICENSE.md)

## Helpful Links

- [NPM Package Page](https://www.npmjs.com/package/react-linkedinbadge)
- [Yarn Package Page](https://yarnpkg.com/package/react-linkedinbadge)
- [GitHub Repository](https://github.com/ziping-liu-corporation/react-linkedin)
- [jsdelivr Page](https://www.jsdelivr.com/package/npm/react-linkedinbadge)
- [LinkedIn Badges](https://www.linkedin.com/badges/profile/create?vanityname=%E2%98%AFliu&preferredlocale=en_US&trk=public_profile_badge&source=react-linkedinbadge)
