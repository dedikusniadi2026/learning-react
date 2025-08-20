import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  Modal,
  Form,
  Input,
  Popconfirm,
  Upload
} from "antd";
import { toast } from "react-toastify";
import { PlusOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Rate } from "antd";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Gagal memuat produk", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
      } else {
        const res = await fetch("https://fakestoreapi.com/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const newProduct = await res.json();
        toast.success("Produk berhasil ditambahkan", { position: "top-right" });

        setProducts((prev) => [...prev, newProduct]);
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
            cursor: "pointer"
          }}
          onClick={() => setPreviewImage(imageUrl)}
        />
      )
    },
    { title: "Name", dataIndex: "title" },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `$${price}`
    },
    { title: "Category", dataIndex: "category" },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (rating) => <Rate allowHalf disabled value={rating?.rate} />
    },
    {
      title: "Action",
      render: (_, record) => (
        <Flex gap="small">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Yakin hapus produk ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Flex>
      )
    }
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16
        }}
      >
        <Button type="primary" onClick={handleAdd}>
          <PlusOutlined /> Add Product
        </Button>

        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title="Yakin hapus semua produk terpilih?"
            onConfirm={handleDeleteAll}
            okText="Ya"
            cancelText="Batal"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete All ({selectedRowKeys.length})
            </Button>
          </Popconfirm>
        )}
      </div>

      <Flex gap="middle" vertical>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys)
          }}
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          
        />
      </Flex>

      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
      >
        <img
          src={previewImage}
          alt="Preview"
          style={{ width: "100%", maxHeight: "70vh", objectFit: "contain" }}
        />
      </Modal>

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Name"
            rules={[{ required: true, message: "Name Product Mandatory" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Harga wajib diisi" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Kategori wajib diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
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
