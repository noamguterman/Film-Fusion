import OpenAI from "openai"
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

const form = document.querySelector("#posterForm")
const movieTitle = document.querySelector("#movie-title")
const artStyles = document.querySelector("#art-styles")
const posterOutput = document.querySelector("#poster-output")

form.addEventListener("submit", function (event) {
  event.preventDefault()
  generatePoster(movieTitle.value, artStyles.value)
  form.reset()
})

async function generatePoster(title, style) {
  posterOutput.innerHTML = ''
  
  const statusEl = document.createElement('p')
  const imageEl = document.createElement('img')
  
  try {
    statusEl.textContent = `Generating a poster for a movie called ${title} in ${style} style...`
    posterOutput.appendChild(statusEl)
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a poster for a movie called ${title} in this style: ${style}.`,
      n: 1,
      size: "1024x1024",
    })
    
    statusEl.textContent = ''
    imageEl.src = response.data[0].url
    imageEl.alt = `Poster for a movie called ${title} in ${style} style.`
    posterOutput.appendChild(imageEl)
    
  } catch(err) {
    statusEl.textContent = 'Error generating image. Please try again.'
  }
}