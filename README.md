## Install

1. npm install --save react-linkedinbadge
1. 	###src/app.tsx
	```tsx
					import React, { Component } from 'react';
					import LinkedinBadgeLoader, { LinkedinBadgeLoaderProps } from 'react-linkedinbadge';
					export default class About extends Component {
						constructor(props:any){
							super(props);

						}
						render() {
							const props: LinkedinBadgeLoaderProps = {
								vanity: 'adamselipsky',
								theme: 'light',
								size: 'large',
								type: 'horizontal',
								locale: 'en_US',
								version: 'v1'
								title: 'Where Are my Wages Selipsky...'
							}
							return (
								<div className="s-about row">
									<div className='col-full'>
									<LinkedinBadgeLoader {...props} />

									</div>
								</div>
							);
						}
					}

					
	```
	###public/index.html
	```html
	<html>
	<body id="root">
	<h1>Add This Below Some Where after the Body of you public/index.html</h1>
	<p>
	Because the react jsx stuff don't work yet.
	Just like the entire Amazon Legal and Amazon HR Org right now because
	<strong>WHERE ARE MY WAGES</strong>
	</p>
	<blockquote>
		<h3>
			This Library is Useful if you want to
			at least place the framing of the badges in your React App 
			using tsx instead of Editing some HTML Language. 
		</h3>
		<p>
			AMAZON CORPORATE LEADERESHIP JUST BECAUSE YOU BELIEVE
			YOU CAN HIDE BEHIND THE FRAMING OF 
			YOUR ENTITY AS AMAZON.COM THIS BIG COMPANY
			SINCE THIS ENTITY IS THE GOLIATH THAT IS "TOO BIG"
			TO SEE ME, ZIPING LIU, SINCE I'M A HUMAN BEING,
			IT DOESN'T MEAN YOU CANNOT HIDE BEHIND LIU CORPORATION LLC
			BECAUSE LIU LLC IS AN ENTITY NOW WITH MORE RIGHTS BIGLY STANDED THAN 
			YOUR SO-CALLED ENTITY OF LEGAL FORMALATIES IN ACTUALITY 
			NO LONGER LEGALLY VALID DUE TO NOT BEING IN GOOD-STANDING.
			I DON'T NEED A COURT TO TELL ME THAT, YOU HAVE TO PROVIDE
			A DOCUMENT FROM ATTORNEY.GENERAL@DELAWARE.GOV STATING YOU ARE 
			IN GOOD STANDING REMEMBER AMAZON LEGAL?
		</p>
		<p>
			SO WHY DON'T YOU BE AN ACTUAL EMPLOYER AND RESPOND WITH ACTION PLANNED 
			INSTEAD OF STILL REMANING QUEIT LIKE YOU DID WHEN THIS
			<cite id="APPEND-A" class="footnote_ref">EMAIL</cite> WAS SENT OUT?
		</p>
	</blockquote>
	</body>
		<script src="https://platform.linkedin.com/badges/js/profile.js" async defer type="text/javascript"></script>
	</html>
	```

## Do you need a demo? Okay here's a demo. You can view it [here](https://ziping.org.cn/#react-linkedinbadge).

1. Amazon Legal? And this is why your terminations are not valid they are not valid termiations because I'm not the one here who is performing my role and expectations like a complete insane child right now, so please action my concerns..

		