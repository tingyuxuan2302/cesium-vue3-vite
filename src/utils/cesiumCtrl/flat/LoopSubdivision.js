class Vector3 {
    constructor(x, y, z) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }
  
    set(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
  
    copy(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
  
    add(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      return this;
    }
  
    divideScalar(scalar) {
      return this.multiplyScalar(1 / scalar);
    }
  
    multiplyScalar(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      this.z *= scalar;
      return this;
    }
  }
  
  const _vector0 = new Vector3();
  const _vector1 = new Vector3();
  const _vector2 = new Vector3();
  const _vec0to1 = new Vector3();
  const _vec1to2 = new Vector3();
  const _vec2to0 = new Vector3();
  
  class LoopSubdivision {
    /**
     * 对顶点的三角形进行细分
     * @param {*} positionArray 顶点数据
     * @param {*} iterations 递归细分次数
     * @param {*} maxTriangles 细分的最大三角形数量
     * @returns 
     */
    static modify(positionArray, iterations = 1, maxTriangles = Infinity) {
      let modifiedPosition = [...positionArray];
  
      for (let i = 0; i < iterations; i++) {
        let currentTriangles = modifiedPosition.length / 3;
        if (currentTriangles < maxTriangles) {
          let subdividedPosition = LoopSubdivision.flatAttribute(modifiedPosition);
  
          modifiedPosition = [];
          modifiedPosition = subdividedPosition;
        }
      }
  
      return modifiedPosition;
    }
  
    /**
     * 一个三角形细分成四个三角形
     * @param {*} positionArray 
     * @returns 
     */
    static flatAttribute(positionArray) {
      const vertexCount = positionArray.length / 3;
  
      const arrayLength = vertexCount * 3 * 4;
      const newPositionArray = new Float32Array(arrayLength);
  
      let index = 0;
      for (let i = 0; i < vertexCount; i += 3) {
        let x0 = i + 0;
        let y0 = i + 0 + vertexCount;
        let z0 = i + 0 + vertexCount * 2;
        _vector0.set(positionArray[x0], positionArray[y0], positionArray[z0]);
  
        let x1 = i + 1;
        let y1 = i + 1 + vertexCount;
        let z1 = i + 1 + vertexCount * 2;
        _vector1.set(positionArray[x1], positionArray[y1], positionArray[z1]);
  
        let x2 = i + 2;
        let y2 = i + 2 + vertexCount;
        let z2 = i + 2 + vertexCount * 2;
        _vector2.set(positionArray[x2], positionArray[y2], positionArray[z2]);
  
        //                 /\ 
        //                /  \
        //               /_ _ \
        //              /\    /\
        //             /  \  /  \
        //            /_ _ \/_ _ \
  
        // 取出三个顶点后，每两个顶点之间取中间点
        _vec0to1.copy(_vector0).add(_vector1).divideScalar(2.0);
        _vec1to2.copy(_vector1).add(_vector2).divideScalar(2.0);
        _vec2to0.copy(_vector2).add(_vector0).divideScalar(2.0);
  
        // 构造三角形
        setTriangle(newPositionArray, index, _vector0, _vec0to1, _vec2to0);
        index += 3;
        setTriangle(newPositionArray, index, _vector1, _vec1to2, _vec0to1);
        index += 3;
        setTriangle(newPositionArray, index, _vector2, _vec2to0, _vec1to2);
        index += 3;
        setTriangle(newPositionArray, index, _vec0to1, _vec1to2, _vec2to0);
        index += 3;
      }
  
      return newPositionArray;
    }
  }
  
  function setTriangle(positions, index, vec0, vec1, vec2) {
    let vertexCount = positions.length / 3;
  
    positions[index + 0] = vec0.x;
    positions[index + 0 + vertexCount] = vec0.y;
    positions[index + 0 + vertexCount * 2] = vec0.z;
  
    positions[index + 1] = vec1.x;
    positions[index + 1 + vertexCount] = vec1.y;
    positions[index + 1 + vertexCount * 2] = vec1.z;
  
    positions[index + 2] = vec2.x;
    positions[index + 2 + vertexCount] = vec2.y;
    positions[index + 2 + vertexCount * 2] = vec2.z;
  }
  
  export { LoopSubdivision };
  