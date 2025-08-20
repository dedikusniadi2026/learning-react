import { useEffect, useState } from "react";
import { Button, Flex, Table, Modal, Form, Input, Popconfirm } from "antd";
import { toast } from "react-toastify";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://fakestoreapi.com/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Gagal memuat users", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
    form.setFieldsValue({
      username: "",
      email: "",
      city: "",
      street: "",
      number: "",
      zipcode: "",
    });
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

      const data = await res.json();

      if (isEditing) {
        setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
        toast.success("User berhasil diupdate", { position: "top-right" });
      } else {
        setUsers((prev) => [...prev, data]);
        toast.success("User berhasil ditambahkan", { position: "top-right" });
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      toast.error("Gagal menyimpan User", { position: "top-right" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://fakestoreapi.com/users/${id}`, { method: "DELETE" });
      toast.success("User berhasil dihapus", { position: "top-right" });
      setUsers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error("Gagal hapus user", { position: "top-right" });
    }
  };

  const handleDeleteAll = async () => {
    try {
      // DELETE semua data terpilih
      await Promise.all(
        selectedRowKeys.map((id) =>
          fetch(`https://fakestoreapi.com/users/${id}`, { method: "DELETE" })
        )
      );
      setUsers((prev) => prev.filter((u) => !selectedRowKeys.includes(u.id)));
      setSelectedRowKeys([]);
      toast.success("User terpilih berhasil dihapus", { position: "top-right" });
    } catch (err) {
      toast.error("Gagal hapus user terpilih", { position: "top-right" });
    }
  };

  const columns = [
    { title: "Username", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
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
        <Flex gap="small">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Yakin hapus user ini?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ya"
            cancelText="Batal"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" onClick={() => handleAdd()}>
          <PlusOutlined /> Add User
        </Button>

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
      </div>

      <br />
      <Flex gap="middle" vertical>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
        />
      </Flex>

      <Modal
        title={isEditing ? "Edit User" : "Add User"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="street" label="Street">
            <Input />
          </Form.Item>
          <Form.Item name="number" label="Number">
            <Input />
          </Form.Item>
          <Form.Item name="zipcode" label="Zipcode">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Users;
