import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { appFeatureOperations } from '../redux/appFeatures';

import '../styles/FeatureCard.scss';

class FeatureCard extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    toggleBookmark(ID) {
        if(localStorage.getItem("bookmarks")) {
            var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
            if(bookmarks.indexOf(ID) > -1) {
                bookmarks.splice(bookmarks.indexOf(ID), 1);
            } else {
                bookmarks.push(ID);
            }
        } else {
            var bookmarks = [ID];
        }
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        this.forceUpdate();
        this.props.setBookmarks(bookmarks);
    }

    render() {
        let isMobile = '';
        if(this.props.view.isMobile) {
            isMobile = 'is-mobile';
        }
        var content = '';
        if (this.props.selectedFeature) {
            var bookmarktag = '';
            var bookmarkicon = "bookmark_border";
            if(localStorage.getItem("bookmarks")) {
                if(JSON.parse(localStorage.getItem("bookmarks")).indexOf(this.props.selectedFeature.attributes.OBJECTID) > -1) {
                    bookmarkicon = "bookmark";
                }
            }
            bookmarktag = <span className={"material-icons featurecard-bookmarkicon " + isMobile} onClick={(e) => {this.toggleBookmark(this.props.selectedFeature.attributes.OBJECTID);}}>{bookmarkicon}</span>;

            let headbarTitleStyle = {
                fontSize: (this.props.selectedFeature.attributes.NAME.length>25)?"20px":"30px",
                marginTop: "0px"
            }
            if(this.props.view.isMobile) {
                headbarTitleStyle = {
                    fontSize: "20px"
                }
            }
            
            if (this.props.selectedFeature.attributes.DESCR) {
                var descriptionsection = 
                <section className={"featurecard-description " + isMobile}>
                    {this.props.selectedFeature.attributes.DESCR}
                </section>;
            }

            if (this.props.selectedFeature.sublocations.length > 0) {
                var containssection = 
                <section className={"featurecard-contains " + isMobile}>
                    <b className={"featurecard-contains-title " + isMobile}>Contains:</b>
                    <ul className={"featurecard-contains-list " + isMobile}>
                        {this.props.selectedFeature.sublocations.map((sl)=>(<li key={"featurecard-contains-"+sl.attributes.OBJECTID} className={"featurecard-contains-listitem"}>{sl.attributes.NAME}</li>))}
                    </ul>
                </section>;
            }
            var content = <div>
                <section className={"featurecard-panel__headbar " + isMobile}>
                    <p className={"title " + isMobile} style={headbarTitleStyle}>{this.props.selectedFeature.attributes.NAME}</p>{bookmarktag}
                    <button className={"closeButton " + isMobile} onClick={()=>{this.props.setSelectedFeature(null)}}><span className="esri-icon-close"></span></button>
                </section>
                <section className={"featurecard-more-info " + isMobile}>
                    <span className={"featurecard-subtitle " + isMobile}>{this.props.selectedFeature.attributes.NAME !== this.props.selectedFeature.attributes.COMMONNAME?this.props.selectedFeature.attributes.COMMONNAME:""}</span>
                    <span>&nbsp;</span>
                    <span className={"badge " + isMobile}>{this.props.config.categories[this.props.selectedFeature.attributes.CATEGORY].name}</span>
                </section>
                <div style={{overflowY:"auto"}}>
                    {descriptionsection}
                    {containssection}
                </div>
            </div>
        }

        return (
            <div className={"featurecard" + isMobile + " " + (this.props.selectedFeature?"":"is-closed")}>
                {content}
            </div>
        );
        
    }

}

const mapStateToProps = state => ({
    view: state.view,
    selectedFeature: state.features.selectedFeature,
    bookmarks: state.features.bookmarks,
    config: state.config
});

const mapDispatchToProps = function (dispatch) {
    return bindActionCreators({
        ...appFeatureOperations
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatureCard)
