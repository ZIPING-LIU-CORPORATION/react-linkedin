# Security Policy

## Supported Versions and their notable differences in Rendering Profile Badges


### Updates and Security Fixes
```bash
Version 4.0 or lower utilizes LinkedIn's [script](https://platform.linkedin.com/badges/js/profile.js) to render the badge. If you want to display a LinkedIn profile badge, I suggest using version 4 or an earlier version of the component. These versions are stable and reliable for rendering profile badges, especially if you have some requirements in only rendering profile badges via the official form provided by LinkedIn.
Version 5.12.\* goes a step even further and no longer utilizes a server-side rendering method by fully rendering the badge through React on the client side. These gradual changes simply add further flexibility and control in how profile badges are rendered, allowing you to properly render and animate badges using any other React components or libraries within your project.
Version 5.16.\* and above now fully supports LinkedIn's method of rendering profile badges, allowing you to use LinkedIn's method if needed in the latest version.
```


| Version | Supported          | Renders using profile.js | Renders through React hooks like profile.js | Renders within itself fully |
| ------- | ------------------ | ------------------------ | ------------------------------------------- | --------------------------- |
| 5.16.x  | :white_check_mark: | :x:                      | :white_check_mark:                          | :white_check_mark:          |
| 5.12.x  | :white_check_mark: | :x:                      | :x:                                         | :white_check_mark:          |
| 5.1.x   | :white_check_mark: | :x:                      | :white_check_mark:                          | :x:                         |
| 5.0.x   | :x:                | :x:                      | :x:                                         | :x:                         |
| 4.0.x   | :white_check_mark: | :white_check_mark:       | :x:                                         | :x:                         |
| < 4.0   | :x:                | :x:                      | :x:                                         | :x:                         |

Using version 4 or earlier versions does not mean that they are outdated, as they are still reliable and stable options for rendering profile badges. **However**, version 5.0+ no longers uses the `profile.js` script and instead carries out the the same tasks using React's lifecycle methods and state management system, removing the need in adding a script tag and relying on an outside script to inject badge content.

### Renders using profile.js
Renders by appending LinkedIn's profile.js to the DOM 
### Renders through React hooks like profile.js
Renders through React hooks by re-implementing profile.js to be done as a React effect, but still uses LinkedIn's api endpoint for rendering as a server-side injected content. This is now fully 
support with version 5.16.x and above, allowing you to use LinkedIn's method if needed in the latest version.

> Note: LinkedIn's method is inherent with issues, and does not allow styling and may not display appropriately depending on the its container's styling given that LinkedIn's method using iframes to display the badge (which naturally have their own styling and sizing issues that can be hard to control and style with CSS), whereas Rendering within itself fully allows you to style the badge as you wish, and even animate it using React's lifecycle methods and hooks, given that no iframes are used,
nor is rendering done through a server-side call and dependency of such call.

### Renders within itself fully
Renders within itself fully and does not use LinkedIn's api, rather a proxied form that provides better security, control, and combatilibity with all devices. This method
is default in version 5.12.x and above.

 

 
## Reporting a Vulnerability

For all issues, including security vulnerabilities, please open an issue on the repository, and is an encouraged practice at least in all projects I maintain given that it:

- Provides a public record of the issue such that that others can avoid or even fix the issue themselves.
- Provides a means of tracking the issue and its resolution.
  Hence, in the worst case where the issue is never resolved there at least exists a form of notice to prevent others in becoming vulnerable to such and hence allowing issues encountered to become an issue that is more widely recognized and possibly addressed by the broader community. Publicly documenting the issues not only increases transparency but also builds a community responsibility where multiple contributors can collaborate on solving problems.
