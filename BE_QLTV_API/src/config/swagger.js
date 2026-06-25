const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Quan ly thu vien",
            version: "1.0.0",
            description: "Tai lieu API quan ly thu vien"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server"
            }
        ],
        components: {
            schemas: {
                Sach: {
                    type: "object",
                    properties: {
                        MaSach: {
                            type: "string",
                            example: "S015"
                        },
                        MaTG: {
                            type: "string",
                            example: "TG001"
                        },
                        MaNXB: {
                            type: "string",
                            example: "NXB001"
                        },
                        MaTL: {
                            type: "string",
                            example: "TL006"
                        },
                        TenSach: {
                            type: "string",
                            example: "Lập trình Node.js"
                        },
                        NamXB: {
                            type: "integer",
                            example: 2026
                        },
                        SoLuong: {
                            type: "integer",
                            example: 10
                        },
                        MaNN: {
                            type: "string",
                            example: "NN001"
                        },
                        MaViTri: {
                            type: "string",
                            example: "KS001"
                        }
                    }
                },
                SachInput: {
                    type: "object",
                    required: [
                        "MaSach",
                        "MaTG",
                        "MaNXB",
                        "MaTL",
                        "TenSach",
                        "NamXB",
                        "MaNN",
                        "MaViTri"
                    ],
                    properties: {
                        MaSach: {
                            type: "string",
                            example: "S015"
                        },
                        MaTG: {
                            type: "string",
                            example: "TG001"
                        },
                        MaNXB: {
                            type: "string",
                            example: "NXB001"
                        },
                        MaTL: {
                            type: "string",
                            example: "TL006"
                        },
                        TenSach: {
                            type: "string",
                            example: "Lập trình Node.js"
                        },
                        NamXB: {
                            type: "integer",
                            example: 2026
                        },
                        SoLuong: {
                            type: "integer",
                            example: 10
                        },
                        MaNN: {
                            type: "string",
                            example: "NN001"
                        },
                        MaViTri: {
                            type: "string",
                            example: "KS001"
                        }
                    }
                },
                NhanVien: {
                    type: "object",
                    properties: {
                        MaNV: {
                            type: "string",
                            example: "NV005"
                        },
                        TenNV: {
                            type: "string",
                            example: "Nguyen Van A"
                        },
                        QueQuan: {
                            type: "string",
                            example: "Ha Noi"
                        },
                        GioiTinh: {
                            type: "string",
                            example: "Nam"
                        },
                        NamSinh: {
                            type: "string",
                            example: "2000"
                        },
                        VaiTro: {
                            type: "string",
                            example: "Thu thu"
                        },
                        Email: {
                            type: "string",
                            example: "vana@gmail.com"
                        },
                        Sdt: {
                            type: "string",
                            example: "0987654321"
                        },
                        User: {
                            type: "string",
                            example: "vana"
                        }
                    }
                },
                NhanVienInput: {
                    type: "object",
                    required: [
                        "MaNV",
                        "TenNV",
                        "QueQuan",
                        "GioiTinh",
                        "NamSinh",
                        "VaiTro",
                        "Email",
                        "Sdt",
                        "User",
                        "Pass"
                    ],
                    properties: {
                        MaNV: {
                            type: "string",
                            example: "NV005"
                        },
                        TenNV: {
                            type: "string",
                            example: "Nguyen Van A"
                        },
                        QueQuan: {
                            type: "string",
                            example: "Ha Noi"
                        },
                        GioiTinh: {
                            type: "string",
                            example: "Nam"
                        },
                        NamSinh: {
                            type: "string",
                            example: "2000"
                        },
                        VaiTro: {
                            type: "string",
                            example: "Thu thu"
                        },
                        Email: {
                            type: "string",
                            example: "vana@gmail.com"
                        },
                        Sdt: {
                            type: "string",
                            example: "0987654321"
                        },
                        User: {
                            type: "string",
                            example: "vana"
                        },
                        Pass: {
                            type: "string",
                            example: "123456"
                        }
                    }
                },
                NhanVienLogin: {
                    type: "object",
                    required: [
                        "User",
                        "Pass"
                    ],
                    properties: {
                        User: {
                            type: "string",
                            example: "nv1"
                        },
                        Pass: {
                            type: "string",
                            example: "123"
                        }
                    }
                },
                TheLoai: {
                    type: "object",
                    properties: {
                        MaTL: {
                            type: "string",
                            example: "TL020"
                        },
                        TenTL: {
                            type: "string",
                            example: "Cong nghe"
                        }
                    }
                },
                TheLoaiInput: {
                    type: "object",
                    required: [
                        "MaTL",
                        "TenTL"
                    ],
                    properties: {
                        MaTL: {
                            type: "string",
                            example: "TL020"
                        },
                        TenTL: {
                            type: "string",
                            example: "Cong nghe"
                        }
                    }
                },
                TacGia: {
                    type: "object",
                    properties: {
                        MaTG: {
                            type: "string",
                            example: "TG015"
                        },
                        TenTG: {
                            type: "string",
                            example: "Nguyen Van B"
                        },
                        NamSinh: {
                            type: "string",
                            example: "1980"
                        },
                        GioiTinh: {
                            type: "string",
                            example: "Nam"
                        },
                        QuocTich: {
                            type: "string",
                            example: "Viet Nam"
                        }
                    }
                },
                TacGiaInput: {
                    type: "object",
                    required: [
                        "MaTG",
                        "TenTG",
                        "GioiTinh",
                        "QuocTich"
                    ],
                    properties: {
                        MaTG: {
                            type: "string",
                            example: "TG015"
                        },
                        TenTG: {
                            type: "string",
                            example: "Nguyen Van B"
                        },
                        NamSinh: {
                            type: "string",
                            example: "1980"
                        },
                        GioiTinh: {
                            type: "string",
                            example: "Nam"
                        },
                        QuocTich: {
                            type: "string",
                            example: "Viet Nam"
                        }
                    }
                },
                NhaXuatBan: {
                    type: "object",
                    properties: {
                        MaNXB: {
                            type: "string",
                            example: "NXB017"
                        },
                        TenNXB: {
                            type: "string",
                            example: "NXB Cong nghe"
                        },
                        DiaChi: {
                            type: "string",
                            example: "Ha Noi"
                        },
                        Email: {
                            type: "string",
                            example: "congnghe@nxb.vn"
                        },
                        Sdt: {
                            type: "string",
                            example: "02431234567"
                        }
                    }
                },
                NhaXuatBanInput: {
                    type: "object",
                    required: [
                        "MaNXB",
                        "TenNXB",
                        "DiaChi",
                        "Email"
                    ],
                    properties: {
                        MaNXB: {
                            type: "string",
                            example: "NXB017"
                        },
                        TenNXB: {
                            type: "string",
                            example: "NXB Cong nghe"
                        },
                        DiaChi: {
                            type: "string",
                            example: "Ha Noi"
                        },
                        Email: {
                            type: "string",
                            example: "congnghe@nxb.vn"
                        },
                        Sdt: {
                            type: "string",
                            example: "02431234567"
                        }
                    }
                },
                DocGia: {
                    type: "object",
                    properties: {
                        MaDG: {
                            type: "string",
                            example: "DG008"
                        },
                        MaKhoa: {
                            type: "string",
                            example: "KH001"
                        },
                        MaLop: {
                            type: "string",
                            example: "L001"
                        },
                        TenDG: {
                            type: "string",
                            example: "Nguyen Van C"
                        },
                        NamSinh: {
                            type: "string",
                            example: "2005"
                        },
                        GioiTinh: {
                            type: "string",
                            example: "Nam"
                        },
                        DiaChi: {
                            type: "string",
                            example: "Ha Noi"
                        },
                        Email: {
                            type: "string",
                            example: "vanc@gmail.com"
                        },
                        Sdt: {
                            type: "string",
                            example: "0987654321"
                        }
                    }
                },
                DocGiaInput: {
                    type: "object",
                    required: [
                        "MaDG",
                        "MaKhoa",
                        "MaLop",
                        "TenDG",
                        "GioiTinh",
                        "DiaChi",
                        "Email",
                        "Sdt"
                    ],
                    properties: {
                        MaDG: {
                            type: "string",
                            example: "DG008"
                        },
                        MaKhoa: {
                            type: "string",
                            example: "KH001"
                        },
                        MaLop: {
                            type: "string",
                            example: "L001"
                        },
                        TenDG: {
                            type: "string",
                            example: "Nguyen Van C"
                        },
                        NamSinh: {
                            type: "string",
                            example: "2005"
                        },
                        GioiTinh: {
                            type: "string",
                            example: "Nam"
                        },
                        DiaChi: {
                            type: "string",
                            example: "Ha Noi"
                        },
                        Email: {
                            type: "string",
                            example: "vanc@gmail.com"
                        },
                        Sdt: {
                            type: "string",
                            example: "0987654321"
                        }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/**/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
