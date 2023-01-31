import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
  Container,
  CssBaseline,
  Grid,
} from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginRight: theme.spacing(2),
    width: '80%',
  },
  button: {
    margin: theme.spacing(1),
  },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    textAlign: 'center',
  },
  titleText: {
    fontSize: '3rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subheaderText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  generatedPostContainer: {
    marginTop: theme.spacing(5),
  },
  generatedPostText: {
    fontSize: '1.25rem',
  },
}));

async function getPostFromApi(niche) {
  const apiKey = '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';
  const model = 'text-davinci-003';
  const promptText = `Write me 5 prompts to input into AI to generate linkedin posts based on the niche of ${niche}.`;
  console.log("PROMPT TEXT" + promptText);

  try {
    // First, generate a list of prompts
    const response = await fetch(`https://api.openai.com/v1/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt: `write me 5 prompts to input into AI to generate linkedin posts based on the niche of ${niche}.`,
        max_tokens: 2048,
        temperature: 0.5,
      }),
    });
    const data = await response.json();
    console.log("PROMPTS: " + data.choices[0].text);
    const prompts = data.choices[0].text.split('\n');

    // Randomly select one of the prompts
    // const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    // alert("Prompt Chosen: " + prompts[Math.floor(Math.random() * prompts.length)]);

    // Use the selected prompt to generate a LinkedIn post
    const postResponse = await fetch(`https://api.openai.com/v1/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt: `Write a multiple paragraph form LinkedIn post/blog using LinkedIn hashtags and common LinkedIn jargon from the prompt: ` + prompts[Math.floor(Math.random() * prompts.length)],
        max_tokens: 2048,
        temperature: 0.4,
      }),
    });
    const postData = await postResponse.json();
    console.log("POSTDATA: " + postData.choices[0].text)
    return postData.choices[0].text;
  } catch (error) {
    console.error(error);
    return error;
  }
}

function App() {
  const classes = useStyles();
  const [niche, setNiche] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');

  async function generatePost() {
    const post = await getPostFromApi(niche);
    setGeneratedPost(post);  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            LinkedIn AI
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.hero}>
        <Container maxWidth="md">
          <div className={classes.titleContainer}>
            <Typography className={classes.titleText}>
              Generate LinkedIn Posts
            </Typography>
            <Typography className={classes.subheaderText}>
              Enter a niche to generate a LinkedIn post
            </Typography>
          </div>
          <form className={classes.form}>
            <FormControl>
              <InputLabel htmlFor="niche">Niche</InputLabel>
              <Input
                id="niche"
                value={niche}
                onChange={(event) => setNiche(event.target.value)}
                className={classes.input}
              />
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={generatePost}
            >
              Generate Post
            </Button>
          </form>
          {generatedPost && (
  <Grid container className={classes.generatedPostContainer}>
    <Grid item xs={12}>
      <Typography className={classes.generatedPostText}>
        {generatedPost.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Typography>
    </Grid>
  </Grid>
)}
        </Container>
      </div>
    </div>
  );
}

export default App;