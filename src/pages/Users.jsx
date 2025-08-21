import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  Modal,
  Form,
  Input,
  Popconfirm,
  Space,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import '../styles/table-custom.css';

const { Title } = Typography;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [ setValue] = useState("");
  const { TextArea } = Input;


  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://fakestoreapi.com/users");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      toast.error("Gagal memuat users", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(value) ||
        u.email.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    setIsEditing(true);
    form.setFieldsValue({
      username: record.username,
      email: record.email,
      city: record.address?.city,
      street: record.address?.street,
      number: record.address?.number,
      zipcode: record.address?.zipcode,
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        username: values.username,
        email: values.email,
        address: {
          city: values.city,
          street: values.street,
          number: values.number,
          zipcode: values.zipcode,
        },
      };

      let res;
      if (isEditing) {
        const updatedUser = { ...editingUser, ...payload };
        res = await fetch(`https://fakestoreapi.com/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });
      } else {
        res = await fetch(`https://fakestoreapi.com/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("API Error");
      const data = await res.json();

      if (isEditing) {
        setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
        setFilteredUsers((prev) =>
          prev.map((u) => (u.id === data.id ? data : u))
        );
        toast.success("User berhasil diupdate", { position: "top-right" });
      } else {
        setUsers((prev) => [...prev, data]);
        setFilteredUsers((prev) => [...prev, data]);
        toast.success("User berhasil ditambahkan", { position: "top-right" });
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan User", { position: "top-right" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://fakestoreapi.com/users/${id}`, { method: "DELETE" });
      toast.success("User berhasil dihapus", { position: "top-right" });
      setUsers((prev) => prev.filter((p) => p.id !== id));
      setFilteredUsers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error("Gagal hapus user", { position: "top-right" });
    }
  };

  
   const handleChange = (e) => {
    let val = e.target.value;

    val = val.replace(/\D/g, "");

    if (val.length > 5) {
      val = val.slice(0, 5);
    }

    setValue(val);
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          fetch(`https://fakestoreapi.com/users/${id}`, { method: "DELETE" })
        )
      );
      setUsers((prev) => prev.filter((u) => !selectedRowKeys.includes(u.id)));
      setFilteredUsers((prev) =>
        prev.filter((u) => !selectedRowKeys.includes(u.id))
      );
      setSelectedRowKeys([]);
      toast.success("User terpilih berhasil dihapus", { position: "top-right" });
    } catch (err) {
      toast.error("Gagal hapus user terpilih", { position: "top-right" });
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Address",
      render: (_, record) => {
        const addr = record.address;
        return addr
          ? `${addr.number} ${addr.street}, ${addr.city}, ${addr.zipcode}`
          : "-";
      },
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Yakin hapus user ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: 20 }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Users Management
        </Title>

        <Space>
          <Input.Search
            placeholder="Cari user..."
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
            Add User
          </Button>
        </Space>
      </Flex>

      <Table
        bordered
        size="middle"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
      />

      <Modal
        title={isEditing ? "Edit User" : "Add User"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }} centered>
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username wajib diisi" }]}
          >
            <Input placeholder="Masukkan username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Email tidak valid" },
            ]}
          >
            <Input placeholder="Masukkan email" />
          </Form.Item>
          <Form.Item name="city" label="City"
             rules={[
              { required: true, message: "city tidak valid" },
            ]}>
            <Input placeholder="Masukkan kota"/>
          </Form.Item>
          <Form.Item name="street" label="Street" 
            rules={[
              { required: true, message: "street tidak valid" },
            ]}>
            <TextArea rows={4} placeholder="Masukan alamat" maxLength={6} />
          </Form.Item>
          <Form.Item name="number" label="Number" rules={[
              { required: true, message: "Number tidak valid" },
            ]}>
              <Input
              placeholder="Masukkan number tlpn"
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
          <Form.Item name="zipcode" label="Zipcode"  rules={[
          { required: true, message: "Kode Pos wajib diisi" },
          { pattern: /^[0-9]{5}$/, message: "Kode Pos harus 5 digit angka" }]}>
            <Input
              placeholder="Masukkan kode pos"
              type="text"
              
              min={0}
              maxLength={5}
              step="any"
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={handleChange}
              />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Users;
