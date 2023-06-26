<div align="center">
  <img src="assets/logo.png" alt="loop logo" width="150"/>
	<h3>
		 OpenAI GPT Powered Test Driven Development. Give Me Tests, I'll Give You Code.
	</h3>
</div>

### Motivation

With the introduction of ChatGPT, one interesting feature it provides is that it can generate code! However, given a prompt for the desired code, the response is often kinda wonky. So, rather than giving it a prompt, why not give it a test? This is the idea behind loop, a simple VS Code extension that supports test-driven development by generating code that passes given tests.

### Usage

#### Full Test Suite

![full test suite](assets/full-test-suite.gif)

#### Partial Test Suite

![partial test suite](assets/partial-test-suite.gif)

### Configuring the extension

There are 2 settings that can be used to configure the extension. Notably, you **MUST** supply your own OpenAI API key. You can see how to generate one [here](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key). I would love to be able to provide a key for everyone to use, but unfortunately, I am poor 😅

```json
"loop": {
  "loop.openaiApiKey": "REQUIRED: enter you OpenAI API key here",
  "loop.model": "by default it's gpt-3.5-turbo, but you can select gpt-4 if you are enrolled in their beta",
}
```
