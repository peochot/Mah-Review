import React, { Component } from 'react';
import Post from "./Post";
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import IconButton from 'material-ui/IconButton';
import ActionBar from "./ActionBar";
import {callQueryParamsApi} from '../util/callApi';

const buttonStyle = {
  height: '100%',
  float: 'left',
  width: '100%'
};

const arrowStyle = {
  width: '100%',
  height: 'auto'
};
const data = [{
  id: 1,
  img: 'http://placehold.it/350x150',
  title: 'Breakfast',
  author: 'jill111',
}, {
  id: 2,
  img: 'http://placehold.it/350x150',
  title: 'Tasty burger',
  author: 'pashminu',
}, {
  id: 3,
  img: 'http://placehold.it/350x150',
  title: 'Camera',
  author: 'Danson67',
}, {
  id: 4,
  img: 'http://placehold.it/350x150',
  title: 'Morning',
  author: 'fancycrave1',
}, {
  id: 5,
  img: 'http://placehold.it/350x150',
  title: 'Hats',
  author: 'Hans',
}, {
  id: 6,
  img: 'http://placehold.it/350x150',
  title: 'Honey',
  author: 'fancycravel',
}, ];

class PostList extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    callQueryParamsApi("post",{}).then((res)=>console.log(res),(err)=>console.log(err));
  }

  render() {
    return (
      <div>
        <ActionBar showDialog={this.props.showDialog}/>
        <div className="product-container">
          {data.map((product, index) => {
            return <Post title={product.title}
                        author={product.author}
                        img={product.img}
                        key={product.id}
                        id={product.id}
                        index={index}/>
          })}
        </div>
      </div>
    )
  }
}

export default PostList;
