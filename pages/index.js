import { useState } from 'react';
import { Box, Heading, Card, CardHeader, CardBody, CardFooter, Button, Spinner } from 'grommet'

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');

  const handlePaste = (e) => {
    setImage(e?.clipboardData?.files?.[0]);
    uploadImage(e?.clipboardData?.files?.[0])
  }

  const uploadImage = async (img) => {
    if (!img) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', img);

    try {
      const response = await fetch('/api/ocr', { method: 'post', body: formData });

      const data = await response.json()
      setText(data.text)
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  }

  return (
    <Box align="center" width="100vw" height="100vh" background="neutral-2" pad={{ top: 'large' }}>
      <Heading>Paste your image!</Heading>
      <Box justify="center">
        <div onPaste={handlePaste}>
          <Card margin="medium" align="center" height="250px" width="500px" pad="large" elevation="small" background="white">
            <CardBody justify="center" align="center">
              <Heading level={3}>
                Paste your image here
              </Heading>
            </CardBody>
          </Card>
        </div>
        {
          loading &&
          <Box height="250px" width="500px" justify="center" align="center">
            <Spinner />
          </Box>
        }
        {
          !loading && text &&
          <Card pad="medium" margin="medium" height="250px" width="500px" elevation="small" background="white">
            <CardHeader justify="center">
              <Heading level={3}>
                Here's your text
              </Heading>
            </CardHeader>
            <CardBody justify="center" align="center" pad="small">
              {
                text && !loading && text
              }
            </CardBody>
            <CardFooter justify="center">
              <Button primary label="Copy" color="neutral-1" onClick={copyToClipboard} />
            </CardFooter>
          </Card>
        }
      </Box>
    </Box>
  )
}

export default Home;
