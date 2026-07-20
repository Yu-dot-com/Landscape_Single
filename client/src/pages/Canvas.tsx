import { useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Group,
  Image as KonvaImage,
  Rect,
  Transformer,
  Line,
  Circle,
} from "react-konva";
import { useDesignStore } from "../stores/useDesignStore";
import type { AssetTemplate, PlacedItem } from "../types/assetTypes";
import useImage from "use-image";
import Konva from "konva";
import { useGetAsset } from "../hooks/useAsset";

interface CanvasItemProps {
  item: PlacedItem;
  template: any;
  isSelected: boolean;
  onSelect: () => void;
  store: any;
}

// -----------------------------------------------------------------
// COMPONENT 1: Standard Raster Assets (Plants, Furniture)
// -----------------------------------------------------------------
function StandardItem({
  item,
  template,
  isSelected,
  onSelect,
  store,
}: CanvasItemProps) {
  const [image, status] = useImage(template.imagePath || "", "anonymous");

  const shapeRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);


  // Attach transformer to selected item
  useEffect(() => {
    const node = shapeRef.current;
    const transformer = transformerRef.current;

    if (node && transformer && isSelected) {
      transformer.nodes([node]);
      transformer.getLayer()?.batchDraw();
    }
  }, [isSelected]);


  // Sync Zustand changes -> Konva node
  useEffect(() => {
    const node = shapeRef.current;

    if (!node) return;

    node.position({
      x: item.x,
      y: item.y,
    });

    node.rotation(item.rotation);

    node.scaleX(1);
    node.scaleY(1);

    node.getLayer()?.batchDraw();

  }, [
    item.x,
    item.y,
    item.rotation,
    item.width,
    item.height
  ]);



  const handleTransformEnd = () => {

    const node = shapeRef.current;

    if (!node) return;


    const scaleX = node.scaleX();
    const scaleY = node.scaleY();


    const newWidth = Math.max(
      15,
      item.width * scaleX
    );

    const newHeight = Math.max(
      15,
      item.height * scaleY
    );


    // reset scale
    node.scaleX(1);
    node.scaleY(1);



    store.updateItemScale(
      item.id,
      newWidth,
      newHeight
    );


    store.updateItemRotation(
      item.id,
      node.rotation()
    );


    transformerRef.current
      ?.getLayer()
      ?.batchDraw();
  };



  return (
    <>
      <Group

        ref={shapeRef}

        x={item.x}

        y={item.y}

        rotation={item.rotation}

        draggable

        onClick={onSelect}

        onTap={onSelect}


        onDragEnd={(e)=>{

          store.updateItemPosition(
            item.id,
            e.target.x(),
            e.target.y()
          );

        }}


        onTransformEnd={handleTransformEnd}

      >


        {
          status === "loaded" && image ? (

            <KonvaImage

              image={image}

              width={item.width}

              height={item.height}

              offsetX={item.width / 2}

              offsetY={item.height / 2}

            />

          ) : (

            <Rect

              width={item.width}

              height={item.height}

              offsetX={item.width / 2}

              offsetY={item.height / 2}

              fill="#ddd"

            />

          )

        }


      </Group>



      {
        isSelected && (

          <Transformer

            ref={transformerRef}

            rotateEnabled={true}

            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right"
            ]}


            keepRatio={false}


            boundBoxFunc={(oldBox,newBox)=>{

              if(
                newBox.width < 15 ||
                newBox.height < 15
              ){
                return oldBox;
              }

              return newBox;

            }}

          />

        )
      }


    </>
  );
}
// -----------------------------------------------------------------
// COMPONENT 2: Interactive Vector Walls
// -----------------------------------------------------------------
function VectorWallItem({
  item,
  isSelected,
  onSelect,
  store,
}: CanvasItemProps) {
  if (!item.points) return null;

  const flatPoints = item.points.flatMap((p) => [p.x, p.y]);

  return (
    <Group
      x={item.x}
      y={item.y}
      rotation={item.rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        store.updateItemPosition(item.id, e.target.x(), e.target.y());
      }}
    >
      <Line
        points={flatPoints}
        fill={item.color || "#64748b"}
        stroke={isSelected ? "#2563eb" : "#334155"}
        strokeWidth={isSelected ? 3 : 1}
        closed={true}
        lineJoin="round"
      />

      {/* 1. INTERACTIVE CORNER HANDLES */}
      {isSelected &&
        item.points.map((point, index) => (
          <Circle
            key={`corner-${index}`}
            x={point.x}
            y={point.y}
            radius={8}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={2}
            draggable
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
            onDragStart={(e) => {
              e.cancelBubble = true;
            }}
            onDragMove={(e) => {
              e.cancelBubble = true;
              store.updateWallVertex(
                item.id,
                index,
                e.target.x(),
                e.target.y(),
              );
            }}
            onDragEnd={(e) => {
              e.cancelBubble = true;
            }}
          />
        ))}

      {/* 2. NEW: INTERACTIVE EDGE/SIDE HANDLES (Midpoints) */}
      {isSelected &&
        item.points.map((point, index) => {
          // Find the next point in the array to form a line segment
          const nextIndex = (index + 1) % item.points!.length;
          const nextPoint = item.points![nextIndex];

          // Calculate the exact center of this line segment
          const midX = (point.x + nextPoint.x) / 2;
          const midY = (point.y + nextPoint.y) / 2;

          return (
            <Circle
              key={`mid-${index}`}
              x={midX}
              y={midY}
              radius={5} // Slightly smaller than corners
              fill="#ffffff"
              stroke="#94a3b8" // Slate grey to distinguish from corner handles
              strokeWidth={2}
              draggable
              onMouseEnter={(e) => {
                const container = e.target.getStage()?.container();
                // Indicate that this handle moves the whole line
                if (container) container.style.cursor = "move";
              }}
              onMouseLeave={(e) => {
                const container = e.target.getStage()?.container();
                if (container) container.style.cursor = "default";
              }}
              onDragStart={(e) => {
                e.cancelBubble = true;
              }}
              onDragMove={(e) => {
                e.cancelBubble = true;

                // Calculate how far the mouse has dragged from the center point
                const dx = e.target.x() - midX;
                const dy = e.target.y() - midY;

                // Move both corners simultaneously
                store.updateWallEdge(item.id, index, nextIndex, dx, dy);
              }}
              onDragEnd={(e) => {
                e.cancelBubble = true;
              }}
            />
          );
        })}
    </Group>
  );
}

// -----------------------------------------------------------------
// MAIN CANVAS
// -----------------------------------------------------------------
export default function Canvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const store = useDesignStore();
  const { data, isLoading } = useGetAsset();
  if (isLoading) {
    return <p>Loading</p>;
  }
  const catalog = (data as unknown as AssetTemplate[]) || [];
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!stageRef.current) return;
    const assetId = e.dataTransfer.getData("text/plain");
    if (!assetId) return;

    stageRef.current.setPointersPositions(e);
    const pointerPosition = stageRef.current.getPointerPosition();
    if (pointerPosition) {
      const scale = stageRef.current.scaleX();
      const x = (pointerPosition.x - stageRef.current.x()) / scale;
      const y = (pointerPosition.y - stageRef.current.y()) / scale;
      const targetTemplate = catalog.find((t) => t.id === assetId);
      if (targetTemplate) {
        store.addItemToCanvasById(targetTemplate, x, y);
      } else {
        console.warn(`Asset template with ID ${assetId} not found in catalog.`);
      }
    }
  };

  const handleStageMouseDown = (e: any) => {
    if (e.target === e.target.getStage()) store.setActivePlacedItemId(null);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;
    if (e.evt.ctrlKey) direction = -direction;

    const scaleBy = 1.03;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  const sortedItems = [...store.placedItems].sort(
    (a, b) => (a.z_index ?? 0) - (b.z_index ?? 0),
  );

  return (
    <div
      className="w-full h-full bg-canvas-grid overflow-hidden"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleStageMouseDown}
        onWheel={handleWheel}
        draggable
      >
        <Layer>
          {sortedItems.map((item) => {
            const template = catalog.find((t) => t.id === item.asset_id);
            if (!template) return null;

            const isSelected = item.id === store.activePlacedItemId;

            if (item.category === "walls") {
              return (
                <VectorWallItem
                  key={item.id}
                  item={item}
                  template={template}
                  isSelected={isSelected}
                  onSelect={() => store.setActivePlacedItemId(item.id)}
                  store={store}
                />
              );
            }

            return (
              <StandardItem
                key={item.id}
                item={item}
                template={template}
                isSelected={isSelected}
                onSelect={() => store.setActivePlacedItemId(item.id)}
                store={store}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
