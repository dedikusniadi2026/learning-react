import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  Modal,
  Form,
  Input,
  Popconfirm,
  Upload,
  Space,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Rate } from "antd";

const { Title } = Typography;



const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [pageSize, setPageSize] = useState(10);


  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      toast.error("Gagal memuat produk", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (value) => {
    const query = value.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      let imageUrl = values.image?.file?.thumbUrl || values.image;

      const payload = {
        ...values,
        image: imageUrl
      };

      if (editingProduct) {
        const res = await fetch(
          `https://fakestoreapi.com/products/${editingProduct.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
        const updated = await res.json();
        toast.success("Produk berhasil diupdate", { position: "top-right" });

        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setFilteredProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      } else {
        const res = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const newProduct = await res.json();
        toast.success("Produk berhasil ditambahkan", { position: "top-right" });

        setProducts((prev) => [...prev, newProduct]);
        setFilteredProducts((prev) => [...prev, newProduct]);
      }

      setIsModalOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan produk", { position: "top-right" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE"
      });

      toast.success("Produk berhasil dihapus", { position: "top-right" });

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error("Gagal hapus produk", { position: "top-right" });
    }
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          fetch(`https://fakestoreapi.com/products/${id}`, {
            method: "DELETE"
          })
        )
      );

      toast.success("Semua produk terpilih berhasil dihapus", {
        position: "top-right"
      });

      setProducts((prev) => prev.filter((p) => !selectedRowKeys.includes(p.id)));
      setFilteredProducts((prev) =>
        prev.filter((p) => !selectedRowKeys.includes(p.id))
      );
      setSelectedRowKeys([]);
    } catch (err) {
      toast.error("Gagal hapus produk", { position: "top-right" });
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="Product"
          style={{
            width: 50,
            height: 50,
            objectFit: "contain",
            borderRadius: 6,
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            cursor: "pointer"
          }}
          onClick={() => setPreviewImage(imageUrl)}
        />
      )
    },
    {
      title: "Name",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `$${price}`,
      sorter: (a, b) => a.price - b.price
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category)
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating.rate - b.rating.rate,
      render: (rating) => <Rate allowHalf disabled value={rating?.rate} />
    },
    {
      title: "Action",
      render: (_, record) => (
        <Flex gap="small">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Yakin hapus produk ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      )
    }
  ];

  return (
    <>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
      <Title level={4} style={{ margin: 0 }}>
          Products Management
        </Title>

          <Space>
          <Input.Search
            placeholder="Cari product..."
            allowClear
            onChange={handleSearch}
            style={{ width: 250 }}
          />

          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`Hapus ${selectedRowKeys.length} user terpilih?`}
              onConfirm={handleDeleteAll}
              okText="Ya"
              cancelText="Batal"
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete All
              </Button>
            </Popconfirm>
          )}

          <Button color="cyan" variant="solid" onClick={handleAdd} icon={<PlusOutlined />}>
              Add Product
          </Button>
        </Space>
      </Flex>

      <Table
        bordered
        size="middle"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys)
        }}
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        loading={loading}
       pagination={{
      pageSize,
      showSizeChanger: true,
      pageSizeOptions: [5, 10, 20, 50],
      onShowSizeChange: (current, size) => setPageSize(size),  }}/>

      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
        bodyStyle={{ backgroundColor: "#000", textAlign: "center" }}
      >
        <img
          src={previewImage}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "70vh" }}
        />
      </Modal>

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        width={500}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Name"
            rules={[{ required: true, message: "Name Product Mandatory" }]}
          >
            <Input placeholder="Masukkan nama produk" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Harga wajib diisi" }]}
          >
            <Input
              placeholder="Masukkan harga produk"
              type="number"
              min={0}
              step="any"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Kategori wajib diisi" }]}
          >
            <Input placeholder="Masukkan kategori produk" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Masukkan deskripsi produk" />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="file"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e && e.fileList[0];
            }}
          >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Pilih Gambar</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      </>
  );
};

export default Products;
