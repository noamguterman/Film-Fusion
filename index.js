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
    
    const response = await fetch('https://film-fusion-worker.noamguterman.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        style
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    statusEl.textContent = ''
    imageEl.src = data.imageUrl
    imageEl.alt = `Poster for a movie called ${title} in ${style} style.`
    posterOutput.appendChild(imageEl)
    
  } catch(err) {
    statusEl.textContent = err.message || 'Error generating image. Please try again.'
    posterOutput.appendChild(statusEl)
  }
}