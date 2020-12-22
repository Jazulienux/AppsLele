import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/admin.css';
import axios from 'axios';
import ReactPlayer from 'react-player'

class UpdateTraining extends Component {
    constructor(props) {
        super();
        this.state = {
            idUpdate: props.id.id.id,
            data: [],
            updateData: [
                {
                    _id: 0,
                    result: 0
                },
                {
                    _id: 1,
                    result: 0
                },
                {
                    _id: 2,
                    result: 0
                }, {
                    _id: 3,
                    result: 0
                },
                {
                    _id: 4,
                    result: 0
                },
                {
                    _id: 5,
                    result: 0
                }
            ]
        }
    }

    componentDidMount() {
        return axios.post(
            "admin/update_train", {
            id: this.state.idUpdate
        }, {
            headers: { "Content-type": "application/json" }
        }).then(res => {
            this.setState({ data: res.data.data })
            Object.values(res.data.data).map((t, i) =>
                this.setState(prev => ({
                    updateData: prev.updateData.map(
                        obj => (
                            obj._id === i ? Object.assign(obj, { "result": t.result }) : obj
                        )
                    )
                }))
            )
        })
    }

    onChangeValue = (e, i) => {
        e.preventDefault();
        const value = e.target.value;
        this.setState(prev => ({
            updateData: prev.updateData.map(
                obj => (
                    obj._id === i ? Object.assign(obj, { "result": value }) : obj
                )
            )
        }))
    }

    onSubmit = () => {
        const data = {
            nama_video: this.state.updateData[0].result,
            rata_rata: this.state.updateData[1].result,
            banyak_box: this.state.updateData[2].result,
            total_nilai_nol: this.state.updateData[3].result,
            label: this.state.updateData[4].result,
            id_training: this.state.updateData[5].result,
        }
        return axios.post(
            "admin/update_train_video", {
            data
        }, {
            headers: { "Content-type": "application/json" }
        }).then(res => {
            alert(res.data.alert);
            window.location.reload(true);
        })
    }

    render() {
        var videoPlay = '';
        if (this.state.updateData[0].result !== 0) {
            videoPlay = require('../video/training/' + this.state.updateData[0].result).default;
        }
        return (
            <div className="wrapper">
                <div className="main_container">
                    <div className="item">
                        <div className="nav_atas">
                            <ul>
                                <li>
                                    <Link to="/training">Form Upload Video</Link>
                                </li>
                                <li>
                                    <Link to="/show_train" className="active_nav_atas">
                                        Show Data Training Video
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="form">
                            <h1 style={{ fontSize: "20px", fontFamily: "sans-serif", marginTop: "20px", textAlign: "left" }}>
                                Update Data Training
                            </h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: "45%" }}>
                                            <center>
                                                Video Training
                                            </center>
                                        </th>
                                        <th>
                                            <center>
                                                Data Training Variable
                                            </center>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            < ReactPlayer
                                                controls={true} url={videoPlay} width={600} height={400} />
                                        </td>
                                        <td>
                                            <table className="tb-view">
                                                <thead>
                                                    <tr>
                                                        <th>Variable</th>
                                                        <th>Output Variable</th>
                                                    </tr>
                                                </thead>

                                                {this.state.data.length !== 0 && Object.values(this.state.data).map((res, i) => {
                                                    return (
                                                        (i < 5) &&
                                                        <tbody key={i}>
                                                            <tr>
                                                                <td>
                                                                    {res.nama}
                                                                </td>
                                                                <td>
                                                                    {i === 0 ?
                                                                        (
                                                                            <input type="text" readOnly={true} name={res.kode} onChange={(e) => this.onChangeValue(e, i)} value={this.state.updateData[i].result} style={{ width: "100%" }} />
                                                                        )
                                                                        :
                                                                        (
                                                                            <input type="text" readOnly={false} name={res.kode} onChange={(e) => this.onChangeValue(e, i)} value={this.state.updateData[i].result} style={{ width: "100%" }} />

                                                                        )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    )
                                                })}
                                                <tbody>
                                                    <tr>
                                                        <td colSpan="2">
                                                            <Link to="show_train">
                                                                <button style={{ padding: "8px 8px", width: "30%", float: "right", marginRight: "15px", background: "red" }} className="btn_tolak">Cancel</button>
                                                            </Link>
                                                            <button onClick={this.onSubmit} style={{ padding: "8px 8px", width: "30%", float: "right", marginRight: "15px" }} className="btn_tolak">Update</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateTraining