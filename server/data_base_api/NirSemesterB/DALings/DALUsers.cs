using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace DALings
{
    public class DALUsers
    {
        static string strCon = @"data source=sql5108.site4now.net;initial catalog=db_a79b5b_proj10;user id=db_a79b5b_proj10_admin;password=zbVK8D2AB29kT7q3";
        static SqlConnection con;
        static DataSet ds;
        static DataTable dtFavorites, dtIngs;
        static SqlDataAdapter adptr;
        static DALUsers()
        {
            con = new SqlConnection(strCon);
        }


        public static int DeleteProduct(int product)
        {
            SqlDataReader reader = null;
            try
            {
                string comm = $"EXEC DeleteProductToUser {product}";
                SqlCommand command=new SqlCommand(comm, con);
                reader = ExcNQ(command);
                if (reader.RecordsAffected == 1)
                {
                    return product;
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                new InvalidOperationException("error in ExcNQ DAL " + ex.Message);
            }
            finally
            {
                reader.Close();
                con.Close();
            }
            return 0;

        }
        public static string GetIngDesc(string ing_name)
        {
            SqlDataReader reader = null;
            try
            {
                string command = $"select [descript] from INGRIDENTS where ing_name=@name";
                SqlCommand comm = new SqlCommand(command, con);
                comm.Parameters.Add(new SqlParameter("@name", System.Data.SqlDbType.NVarChar));
                comm.Parameters["@name"].Value = ing_name;
                reader = ExcNQ(comm);
                if (reader.Read())
                {
                    return (string)reader["descript"];
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                new InvalidOperationException("error in ExcNQ DAL " + ex.Message);
            }
            finally
            {
                reader.Close();
                con.Close();
            }
            return null;
        }

        public static Product AddProduct(Product product)
        {
            string cmd;
            SqlCommand insert;
            SqlConnection con = new SqlConnection(strCon);
            int product_id=-1;
            con.Open();
            Product p = new Product(product.name, product.category, product.ingridentities,product.user_id);

            cmd = $"EXEC ADDPRODUCT @product_name,@product_category";
            insert = new SqlCommand(cmd, con);
            insert.Parameters.Add(new SqlParameter("@product_name", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@product_name"].Value =product.name;
            insert.Parameters.Add(new SqlParameter("@product_category", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@product_category"].Value = product.category;
            insert.ExecuteNonQuery();
            product_id = GetProductId();
            if (product_id == -1)
                return null;
            foreach (Ingridents item in p.ingridentities)
            {
                cmd = $"EXEC ADDINGS @name,@description,{product_id}";
                insert = new SqlCommand(cmd, con);
                insert.Parameters.Add(new SqlParameter("@description", System.Data.SqlDbType.NVarChar));
                insert.Parameters["@description"].Value = item.description;
                insert.Parameters.Add(new SqlParameter("@name", System.Data.SqlDbType.NVarChar));
                insert.Parameters["@name"].Value = item.name;
                insert.ExecuteNonQuery();
            }

            string dateString = DateTime.Now.ToString("yyyy-MM-dd");

            cmd = $"insert into PRODUCTS_TO_USER([id],[product_code],[date_of_scan],[name_of_product],[product_image]) " +
                $"values(@user_id,@product_id,@dateString,@product_name,@empty)";
            insert = new SqlCommand(cmd, con);
            insert.Parameters.Add(new SqlParameter("@user_id", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@user_id"].Value = p.user_id;
            insert.Parameters.Add(new SqlParameter("@product_id", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@product_id"].Value = product_id;
            insert.Parameters.Add(new SqlParameter("@dateString", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@dateString"].Value = dateString;
            insert.Parameters.Add(new SqlParameter("@product_name", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@product_name"].Value = p.name;
            insert.Parameters.Add(new SqlParameter("@empty", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@empty"].Value = "";
            insert.ExecuteNonQuery();
            con.Close();
            return p;
        }



        public static Register AddUser(Register value)
        {

            SqlDataReader reader = null;
            try
            {
                string cmd = $"EXEC CHECK_ID @pass,@name,@mail";
                SqlCommand insert = new SqlCommand(cmd, con);
                insert.Parameters.Add(new SqlParameter("@pass", System.Data.SqlDbType.NVarChar));
                insert.Parameters["@pass"].Value = value.pass;
                insert.Parameters.Add(new SqlParameter("@name", System.Data.SqlDbType.NVarChar));
                insert.Parameters["@name"].Value = value.user_name;
                insert.Parameters.Add(new SqlParameter("@mail", System.Data.SqlDbType.NVarChar));
                insert.Parameters["@mail"].Value = value.user_mail;
                reader = ExcNQ(insert);
                int effect = reader.RecordsAffected;
                if (effect == -1)
                {
                    con.Close();
                    return null;
                }   
                else
                {
                    reader.Close();
                    insert.ExecuteNonQuery();
                    Register user = new Register(value.pass, value.user_name, value.user_mail);
                    return user;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                new InvalidOperationException("error in ExcNQ DAL " + ex.Message);
            }
            finally
            {
                reader.Close();
                con.Close();

            }
            return null;

        }

        public static string AddImage(ImageToAdd image_to_add)
        {
            string cmd = $"update [dbo].[PRODUCTS_TO_USER] set [product_image]=@p_image where [product_code]=@p_code";
            SqlCommand insert = new SqlCommand(cmd, con);
            insert.Parameters.Add(new SqlParameter("@p_image", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@p_image"].Value = image_to_add.image;
            insert.Parameters.Add(new SqlParameter("@p_code", System.Data.SqlDbType.NVarChar));
            insert.Parameters["@p_code"].Value = image_to_add.id;
            con.Open();
            try
            {
                insert.ExecuteNonQuery();
                return "succes";
            }
            catch (Exception ex)
            {
                 new InvalidOperationException("error in ExcNQ DAL " + ex.Message);
            }
            finally
            {
                con.Close();
            }
            return "";
        }
        public static DataTable GetAllIngs(int id)
        {
            SqlConnection con = new SqlConnection(strCon);
            SqlCommand cmd = new SqlCommand($"EXEC PROC_LIST_OF_INGS {id}", con);
            adptr = new SqlDataAdapter(cmd);
            dtIngs = new DataTable();
            adptr.Fill(dtIngs);
            return dtIngs;
        }

        public static DataTable GetAllFavorites(int id)
        {
            SqlConnection con = new SqlConnection(strCon);
            SqlCommand cmd = new SqlCommand($"EXEC Product_To_User {id}", con);
            adptr = new SqlDataAdapter(cmd);
            dtFavorites = new DataTable();
            adptr.Fill(dtFavorites);
            return dtFavorites;

        }
        
        public static LastProduct GetLastProduct(int id)
        {
            SqlDataReader reader = null;
            try
            {
                string cmd = $"exec GetProduct @id";
                SqlCommand insert = new SqlCommand(cmd, con);
                insert.Parameters.Add(new SqlParameter("@id", System.Data.SqlDbType.Int));
                insert.Parameters["@id"].Value = id;
                reader = ExcNQ(insert);
                if (reader.Read())
                {
                    return new LastProduct()
                    {
                        DateOf = (DateTime)reader["date_of_scan"],
                        ID = (int)reader["id"],
                        Name_Of_Product = (string)reader["name_of_product"],
                        id_prod = (int)reader["product_code"]

                    };
                    
                }
                
              
            }
            catch (Exception ex)
            {
                new InvalidOperationException("error in ExcNQ DAL " + ex.Message);
            }
            finally
            {
                reader.Close();
                con.Close();
            }
            return null;
                
        }
        
        public static int GetProductId()
        {
            SqlDataReader reader = null;
            try
            {
               string cmd = "SELECT TOP 1 product_code FROM PRODUCT ORDER BY product_code desc";
                SqlCommand comm = new SqlCommand(cmd, con);
                reader = ExcNQ(comm);
                if (reader.Read())
                {
                   return (int)reader["product_code"];
                }
                else
                {
                    return -1;
                }
            }
            catch (Exception ex)
            {
                new InvalidOperationException("error in ExcNQ DAL " + ex.Message);
            }
            finally
            {
                reader.Close();
                con.Close();
            }
            return -1;
        }
        
        public static Users ShowUserById(string pass, string user_mail)
        {
            SqlDataReader reader = null;
            try
            {
                string comm = $" EXEC LOGIN_USER @mail, @pass";
                SqlCommand insert = new SqlCommand(comm, con);
                insert.Parameters.Add(new SqlParameter("@mail", System.Data.SqlDbType.NVarChar));
                insert.Parameters["@mail"].Value = user_mail;
                insert.Parameters.Add(new SqlParameter("@pass", System.Data.SqlDbType.NVarChar));
                insert.Parameters["@pass"].Value = pass;
                reader = ExcNQ(insert);
                if (reader.Read())
                {
                    return new Users()
                    {
                        id = (int)reader["id"],
                        user_name = (string)reader["user_name"],
                        pass = (string)reader["pass"],
                        user_mail = (string)reader["user_mail"]
                    };
                }
                else
                {
                    return null;
                }
             
            }
            catch (Exception ex)
            {
                new InvalidOperationException("error in ExcNQ DAL " + ex.Message);
            }
            finally
            {
                reader.Close();
                con.Close();
            }
            return null;
        }




        public static GetProduct GetProductDetails(string product_name)
        {
            SqlDataReader reader = null;
            try
            {
                string cmd = $"SELECT * FROM PRODUCT Where product_name=@name";
                SqlCommand insert = new SqlCommand(cmd, con);
                insert.Parameters.Add(new SqlParameter("@name", System.Data.SqlDbType.NVarChar));
                insert.Parameters["@name"].Value = product_name;
                reader = ExcNQ(insert);
                if (reader.Read())
                {

                    return new GetProduct()
                    {
                        productCode = (int)reader["product_code"],
                        categoryCode = (int)reader["category_code"],
                        Name = (string)reader["product_name"],
                        Image_product = (string)reader["image_product"]
                    };
                }
                else
                {
                    return null;
                }
                
            }
            catch (Exception ex)
            {
                new InvalidOperationException("error in ExcNQ DAL " + ex.Message);

            }
            finally
            {
                reader.Close();
                con.Close();
            }

            return null;

        }
        

        public static SqlDataReader ExcNQ(SqlCommand comm)
        {
            SqlDataReader reader = null;
            try
            {
                con.Open();
                reader = comm.ExecuteReader();
                return reader;
            }
            catch (Exception ex)
            {
                new InvalidOperationException("error in ExcNQ DAL " + ex.Message);
            }
            return reader;
        }



    }
}
