AppiumInspector
===============

A basic inspector for [Appium](http://appium.io/). Its built using HTML and JS with jQuery library.

Reason to Build: The curent appium inspector does not map elements correctly if the App switches to landscape mode. So its 
currently built to be used on top of [Appium UI](https://bitbucket.org/appium/appium.app/downloads).

NOTE: I havn't tested it on apps which use portrait orientation. 

How To Use:
-----------

* 1. Start Appium UI and launch the server with necessary fields filled in.
* 2. Click on the inspect button.
* 3. After the simulator is launched open public_html/index.html in Chrome (Haven't tested on other browsers)
* 4. Copy the Appium session ID from Appium UI and paste it in the "Session" field in Chrome. Also fill in the Appium servers IP and Port.
* 5. Click on the Fetch button

Features:
---------
* Displays component view on the right and screen view on the left bot of which are interconnected 
* Mouseover the element displays all the element properties
* Ctrl + -   => Use this hotkey to push an element back in case its overlapping other elements
* Ctrl + l   => Lock the inspector
* Ctrl + u   => Unlock the inspector
