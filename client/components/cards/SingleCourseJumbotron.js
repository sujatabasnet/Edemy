import { Badge, Button } from "antd";
import { currencyFormatter } from "../../utils/helpers";
import {LoadingOutlined, SafetyOutlined} from '@ant-design/icons'

const SingleCourseJumbotron = ({ 
    course , 
    loading, 
    user, 
    handlePaidEnrollment, 
    handleFreeEnrollment,
    enrolled,
    setEnrolled,
}) => {
const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  return (
    <div className="jumbotron bg-primary square">
      <div className="row">
        <div className="col-md-8">
          <h1 className="text-light font-weight-bold">{name}</h1>
          <p className="lead">
            {description && description.substring(0, 160)}...
          </p>
          <Badge
            count={category}
            style={{ backgroundColor: "0#3a9f4" }}
            className="pb-4 mr-2"
          />
          <p>Created by {instructor.name}</p>
          <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
          <h4 className="text-light">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: "inr",
                })
              : "Free"}
          </h4>
        </div>
        <div className="col-md-4">
            {loading? (
                <div className="d-flex justify-content-senter">
                    <LoadingOutlined className="h1 text-danger"/>
                </div>
            ) : (
                <Button
                    className="mb-3 mt-3"
                    type="danger"
                    block
                    shape="round"
                    icon={<SafetyOutlined/>}
                    size= "large"
                    disabled={loading}
                    onClick={paid? handlePaidEnrollment : handleFreeEnrollment}
                >{user ? enrolled.status? "Go to course" :  "Enroll" : "Login to enroll"}</Button>
            )}    
        </div>
    </div>
    </div>
);
};

export default SingleCourseJumbotron;
