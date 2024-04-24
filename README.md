## What is This?
This is a custom react component that allows you to use [LinkedIn badges](https://www.linkedin.com/badges/profile/create?vanityname=%E2%98%AFliu&preferredlocale=en_US&trk=public_profile_badge&source=ziping.org) within your react application with ease. It essentially wraps the LinkedIn badge code in a react component and handles all the necessary script loading, and element mounting for you.

## How to Use
1. Install the package using npm or yarn
```bash
npm install react-linkedinbadge
```
or
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


### Links
- [NPM Package](https://www.npmjs.com/package/react-linkedinbadge)
- [Yarn Package](https://yarnpkg.com/package/react-linkedinbadge)
- [GitHub Repository](https://github.com/ziping-liu-corporation/react-linkedin)
- [LinkedIn Badge Creation](https://www.linkedin.com/badges/profile/create?vanityname=%E2%98%AFliu&preferredlocale=en_US&trk=public_profile_badge&source=ziping.org)