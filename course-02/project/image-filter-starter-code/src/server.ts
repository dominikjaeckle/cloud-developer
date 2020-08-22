import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isUrl, isImageFile} from './util/util';
import { filter } from 'bluebird';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage/", ( req: Request, res: Response ) => {
    let { image_url } = req.query;
    if (!image_url) {
      return res.status(400).send(`Please provide a url as parameter`);
    }

    // validate the image url using a REGEX parser + a filetype checker
    const valid = isUrl(image_url) ? isImageFile(image_url) : false;
    if (!valid) {
      return res.status(400).send(`The provided URL ${image_url} is invalid.`);
    }

    // filter the image
    let result = filterImageFromURL(image_url).then((f: string) => {
      return res.status(200).sendFile(f, () => {
        deleteLocalFiles([f]);
      });
    }).catch((r: string) => {
      return res.status(500)
        .send("Cannot process image file. Please double check the file URL.")
    })
  } );
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();