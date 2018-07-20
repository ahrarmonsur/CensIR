# CensIR: Manage an unpredictable internet
### Equithon 2018 Project Entry

## Inspiration
In the US alone, there are 25 million people struggling with PTSD every single day. It is estimated that 1 out of every 9 women develops PTSD, which is twice as likely as men. We feel that PTSD is one of the less well-known mental health issues, so we are happy to contribute to the cause through our project: CensIR.

## What it does
CensIR is a google chrome extension that censors potentially unsafe images of drugs, gore, or suggestive/explicit content for sensitive users (i.e., victims of rape, PTSD, addiction). The extension uses Clarifai's AI-backed image classification models to preemptively obscure these images while giving the user meaningful information about the potential triggers and the confidence level. The user is still able to manually override the censoring to view the content.

## How we built it
CensIR was developed as a Google Chrome Extension. We used the standard web-development tools (Javascript, HTML, CSS), along with the chrome browser APIs to allow the extension to manipulate the content of the web page. To determine if the content is unsafe, we used the Clarifai image classification API. Clarifai using AI-powered image classification algorithms to categorize the content's likelihood of being gore, drugs, or suggestive/explicit content.

## Challenges we ran into
The machine learning model we used (Clarifai) is still in beta, so CensIR has a tendency to give false positives when deciding if content is triggering.

## Accomplishments that we're proud of
Overall, we completed the our minimum-viable product with all the essential features
Communicating to the user the classification of the image is easy to understand
Circumventing blocked images is easy and intuitive for the user, contributing to a smooth UX
Providing a confidence level of the classification

## What we learned
The Clarifai API is very extensible
Google chrome extensions are an effective way of enhancing UX with ease of coding
Accurate image recognition is difficult and requires a large training data set

## What's next for CensIR
In the future, CensIR can be improved by more rigorously training the Clarifai model to give less false positives when determining if content is explicit. This will allow PTSD users a more consistent and reliable experience with CensIR.
