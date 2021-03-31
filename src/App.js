import React, {Component} from 'react'
import firebase from './firebase';

export class App extends Component {

  state = {
    file: null,
    algo : 2,
    urlImage: 'not defined'
  }
  

  handleChange = (newFile) => {
    this.setState({
      file : newFile,
      algo : 4,
      urlImage: 'not defined'
    })
  }

  handleSubmit = () => {

    console.log(this.state.file);
    // Create a root reference
    let storageRef = firebase.storage().ref();
    // Create a reference to 'landscape.jpg';


    // Create the file metadata
    let metadata = {
          contentType: 'image/jpg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        let uploadTask = storageRef.child('images/landscape').put(this.state.file[0], metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                break;

              // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          }, 
          () => {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at', downloadURL);
              this.setState({
                    file : this.state.file,
                    algo : this.state.algo,
                    urlImage: downloadURL
                  })

            });
          }
        );
  }

  showImage= () => {



    /*
    let storageRef = firebase.storage().ref()
    let spaceRef = storageRef.child('images/'+this.state.files[0].name)
    storageRef.child('images/' + this.state.files[0].name).getDownloadURL().then((url) => {
      console.log(url)
      document.getElementById('new-img').src = url
    })
    */
  }


  render() {
    console.log(`This is the url :  ${this.state.urlImage}`);
    let element = <p> no image </p>
    if (this.state.urlImage !== '') {
        element = <p> {this.state.urlImage}</p>;
    }
        return (


      <div>
        <input type="file" onChange={(e) => {this.handleChange(e.target.files)}} />
        <button onClick= {this.handleSubmit}>Submit </button>
        <button onClick = {this.showImage}>Show image</button>
        <h1> {this.state.urlImage}</h1>
      </div>
    )

  }


}

export default App;