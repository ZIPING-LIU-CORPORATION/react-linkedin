# Security Policy

## Supported Versions

### Utilizling Linkedin's methods instead with this Com ponent

Version 4.0 or lower utilizes LinkedIn's [script](https://platform.linkedin.com/badges/js/profile.js) to render the badge. I recommend using version 4 or lower in case you require rendering via LinkedIn's method by any means. Version 4 by the means is a version that has issues or functionality flaws, and is a stable legacy version of the component. Version 5.0 given that it fully integrates rendering within the component and thus utilizes full adherence toward React's lifecycle methods and state management system, provides even fuller abilities in allowing the badge to properly render and animate utilizing any other React components or libraries within your project.

| Version | Supported          | Renders using profile.js | Renders through React hooks like profile.js | Renders within itself fully |
| ------- | ------------------ | ------------------------ | ------------------------------------------- | --------------------------- |
| 5.12.x  | :white_check_mark: | :x:                      | :x:                                         | :white_check_mark:          |
| 5.1.x   | :white_check_mark: | :x:                      | :white_check_mark:                          | :x:                         |
| 5.0.x   | :x:                | :x:                      | :x:                                         | :x:                         |
| 4.0.x   | :white_check_mark: | :white_check_mark:       | :x:                                         | :x:                         |
| < 4.0   | :x:                | :x:                      | :x:                                         | :x:                         |

The development of this react component has undergone significant implementation and logical changes that completely change how the badge rendering is handled. Depending on the kind of use case you might find yourself requiring, considering using a specific version of the Badge to suit your needs.

For example, to use the component that fully uses the provided script from LinkedIn in rendering, use version 4.0.x. Use the latest version (5.12.x)
to fully render badges client side as ReactNodes/JSX.Elements, which also provides more control over styling and css given that by default, LinkedIn badges inject a incredibly large global stylesheet that can end up changes how elements look on your page.

Please not that the crosses shown above mean that the version does not support functionality of rendering through the given method, and will result in rendering issues if you decided to configure the LinkedInBadge component to render that way in an unsupported version.

## Reporting a Vulnerability

For all issues, including security vulnerabilities, please open an issue on the repository, and is an encouraged practice at least in all projects I maintain given that it:

- Provides a public record of the issue such that that others can avoid or even fix the issue themselves.
- Provides a means of tracking the issue and its resolution.
  Hence, in the worst case where the issue is never resolved there at least exists a form of notice to prevent others in becoming vulnerable to such and hence allowing issues encountered to become an issue that is more widely recognized and possibly addressed by the broader community. Publicly documenting the issues not only increases transparency but also builds a community responsibility where multiple contributors can collaborate on solving problems.
