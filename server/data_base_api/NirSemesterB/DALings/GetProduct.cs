using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DALings
{
    public class GetProduct
    {
        public int productCode { get; set; }
        public int categoryCode { get; set; }
        public string Name { get; set; }
        public string Image_product { get; set; }

        public GetProduct(int productCode, int categoryCode, string Name,string image_product)
        {
            this.productCode= productCode;
            this.categoryCode= categoryCode;
            this.Name = Name;
            this.Image_product = image_product;
        }
        public GetProduct()
        { }
    }
}
