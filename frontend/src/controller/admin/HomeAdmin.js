import React, { Component } from 'react';
import '../assets/css/admin.css';

class HomeAdmin extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="wrapper">
        <div className="main_container">
          <div className="item" style={{ marginLeft: "10px" }}>
            <b>
              Selamat Datang Admin{' '}, dalam Sytem
              Klasifikasi Bibit Lele dengan Menggunakan Metode KNN - Naive bayes
            </b>
            <br />
            <br />
            <b>Admin Dapat Melakukan Pengelolaan System Antara Lain : </b>
            <br />
            <div style={{ marginTop: 10 }}>
              1. Mengolah Data Training dari Video Lele
            </div>
            <div style={{ marginTop: 10 }}>
              2. CRUD Data Training Klasifikasi Lele
            </div>
            <div style={{ marginTop: 10 }}>
              3. Melakukan Testing Klasifikasi Bibit Lele
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeAdmin;
