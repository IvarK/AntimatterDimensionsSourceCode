
JavaScript with TypeScript Getting Started Guide
----

This guide will help you make your first API call using a Web TypeScript environment.

TypeScript Project Setup
----

* OS: This guide is written for Windows 10 and Visual Studio
  * The "Project Setup" section of this guide will not be very useful for other operating systems and environments (sorry!)
  * TypeScript works on a wide variety of Operating Systems, Environments, and tools
* Installation
  * Download and install Visual Studio 2015
    * Update TypeScript within VS to the [latest version](https://www.microsoft.com/en-us/download/details.aspx?id=48593) (2.1.5 when this document was written)
    * [OPTIONAL] Install the [Node.js tools](https://www.visualstudio.com/vs/node-js/) into Visual Studio
  * Download and extract the [PlayFab JavaScriptSDK](https://github.com/PlayFab/JavaScriptSDK/archive/master.zip) to a local folder of your choosing {playFabSdkLocation}
* New Project Setup
  * Open Visual Studio and create a new "Blank Node.js Web Application"
    * ![TS image](/public/images/TypeScript/NewProj.png)
    * This creates a project with several setup files
    * [OPTIONAL] delete app.cs (We won't be using it)
* In Windows Explorer, navigate to {playFabSdkLocation}/PlayFabSdk and find the "src" folder
* In another Windows Explorer window, navigate to your new Visual Studio project
  * Copy the "src" folder from {playFabSdkLocation}/PlayFabSdk, into your project folder
* Close the explorer windows, and return to Visual Studio
* Toggle the "Show All Files" button a few times, until you can see the PlayFab source files
* RClick "src" and "Include in Project"
  * ![TS image](/public/images/TypeScript/IncludeSdk.png)
* At this point, running the project will open a browser, and display the default Microsoft example
* Project setup complete!


Set up your first API call
----

This guide will provide the minimum steps to make your first PlayFab API call.  Confirmation will be visible on the webpage.

In your favorite text-editor, update the contents of index.html as follows:
```HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PlayFab JavaScript Unit Tests</title>
    <script type="text/javascript" src="src/PlayFab/PlayFabClientApi.js"></script>
    <script type="text/javascript" src="app.js"></script>
</head>
<body>
    PlayFab Getting Started Guide<br/>
    TitleID: <input type="text" id="titleId" value="144"><br/>
    CustomID: <input type="text" id="customId" value="GettingStartedGuide"><br/>
    <input type="button" value="Call LoginWithCustomID" onclick="DoExampleLoginWithCustomID()"><br/>
    Result:<br/>
    <textarea id="resultOutput" cols="60" rows="5"></textarea><br/>
</body>
</html>
```

In your favorite text-editor, update the contents of app.ts as follows:
```TypeScript
function DoExampleLoginWithCustomID(): void {
    PlayFab.settings.titleId = (<HTMLInputElement>document.getElementById("titleId")).value;
    var loginRequest: PlayFabClientModels.LoginWithCustomIDRequest = {
        CustomId: (<HTMLInputElement>document.getElementById("customId")).value,
        CreateAccount: true
    };

    PlayFabClientSDK.LoginWithCustomID(loginRequest, LoginCallback);
}

var LoginCallback = function (result: PlayFabModule.SuccessContainer<PlayFabClientModels.LoginResult>, error: PlayFabModule.IPlayFabError): void {
    if (result !== null) {
        document.getElementById("resultOutput").innerHTML = "Congratulations, you made your first successful API call!";
    } else if (error !== null) {
        document.getElementById("resultOutput").innerHTML =
            "Something went wrong with your first API call.\n" +
            "Here's some debug information:\n" +
            CompileErrorReport(error);
    }
}

// This is a utility function we haven't put into the core SDK yet.  Feel free to use it.
function CompileErrorReport(error: PlayFabModule.IPlayFabError): string {
    if (error === null)
        return "";
    var fullErrors: string = error.errorMessage;
    for (var paramName in error.errorDetails)
        for (var msgIdx in error.errorDetails[paramName])
            fullErrors += "\n" + paramName + ": " + error.errorDetails[paramName][msgIdx];
    return fullErrors;
}
```

Finish and Execute
----

* Run the program: Drop Down -> Debug -> Start Debugging
* In the new browser window, click the "Call LoginWithCustomID" button
* You should see the following text in the Result section:
```text
Congratulations, you made your first successful API call!
```

* At this point, you can start making other api calls, and building your game
* For a list of all available client API calls, see our documentation:
  * https://api.playfab.com/
* Happy coding!

Deconstruct the code
----


This optional last section describes each part of this example in detail.

The HTML file has a few important lines:
```HTML
<script type="text/javascript" src="src/PlayFab/PlayFabClientApi.js"></script>
```

This line loads the Client-SDK from the local PlayFabSDK file. The latest version of this file is also available from [our CDN](https://download.playfab.com/PlayFabClientApi.js).  For more information read our [CDN blog post](https://blog.playfab.com/blog/playfab-now-serving-javascript-sdk-via-cdn/).

The other important HTML lines:
```HTML
<script type="text/javascript" src="app.js"></script>
...
<input type="button" value="Call LoginWithCustomID" onclick="DoExampleLoginWithCustomID()"><br />
```

As you can see above, app.js contains the DoExampleLoginWithCustomID function. These lines bind our js file to our webpage, and invoke the DoExampleLoginWithCustomID function in that script.  Everything else is just GUI.  The name "app.js" is based on the typescript file in our default project "app.ts".  If you rename "app.ts", it will generate a ".js" file with the same name.  You should not try to add ".ts" scripts directly to a webpage.  For more information about TypeScript, read the [TypeScript tutorial](https://www.typescriptlang.org/docs/tutorial.html).

* Line by line breakdown for app.js
  * PlayFab.settings.titleId = (&lt;HTMLInputElement>document.getElementById("titleId")).value;
    * This reads the titleId from the html-input, and sets it to the PlayFab sdk.  TypeScript defines that getElementById returns type HTMLElement.  We must cast that to the sub-type HTMLInputElement to get the input-specific field "value".
    * Every PlayFab developer creates a title in Game Manager.  When you publish your game, you must code that titleId into your game.  This lets the client know how to access the correct data within PlayFab.  For most users, just consider it a mandatory step that makes PlayFab work.
  * var loginRequest: PlayFabClientModels.LoginWithCustomIDRequest = { TitleId: PlayFab.settings.titleId, CustomId: "GettingStartedGuide", CreateAccount: true };
    * Most PlayFab API methods require input parameters, and those input parameters are packed into a request object
    * Every API method requires a unique request object, with a mix of optional and mandatory parameters
      * We also cast this request to LoginWithCustomIDRequest, which is the required type for PlayFabClientSDK.LoginWithCustomID
      * For LoginWithCustomIDRequest, there is a mandatory parameter of CustomId, which uniquely identifies a player and CreateAccount, which allows the creation of a new account with this call.
  * PlayFabClientSDK.LoginWithCustomID(loginRequest, LoginCallback);
    * This begins the async request to "LoginWithCustomID", which will call LoginCallback when the API call is complete
    * For login, most developers will want to use a more appropriate login method
      * See the [PlayFab Login Documentation](https://api.playfab.com/Documentation/Client#Authentication) for a list of all login methods, and input parameters.  Common choices are:
        * [LoginWithAndroidDeviceID](https://api.playfab.com/Documentation/Client/method/LoginWithAndroidDeviceID)
        * [LoginWithIOSDeviceID](https://api.playfab.com/Documentation/Client/method/LoginWithIOSDeviceID)
        * [LoginWithEmailAddress](https://api.playfab.com/Documentation/Client/method/LoginWithEmailAddress)
* LoginCallback contains two parameters: result, error
  * When successful, error will be null, and the result object will contain the requested information, according to the API called
    * This result contains some basic information about the player, but for most users, login is simply a mandatory step before calling other APIs.
  * If error is not null, your API has failed
    * API calls can fail for many reasons, and you should always attempt to handle failure
    * Why API calls fail (In order of likelihood)
      * PlayFabSettings.TitleId is not set.  If you forget to set titleId to your title, then nothing will work.
      * Request parameters.  If you have not provided the correct or required information for a particular API call, then it will fail.  See error.errorMessage, error.errorDetails, or error.GenerateErrorReport() for more info.
      * Device connectivity issue.  Cell-phones lose/regain connectivity constantly, and so any API call at any time can fail randomly, and then work immediately after.  Going into a tunnel can disconnect you completely.
      * PlayFab server issue.  As with all software, there can be issues.  See our [release notes](https://api.playfab.com/releaseNotes/) for updates.
      * The internet is not 100% reliable.  Sometimes the message is corrupted or fails to reach the PlayFab server.
    * If you are having difficulty debugging an issue, and the information within the error information is not sufficient, please visit us on our [forums](https://community.playfab.com/index.html)

