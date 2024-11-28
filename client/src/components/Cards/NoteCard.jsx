import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  onEdit,
  isPinned,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="rounded-lg p-6 bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h6 className="text-lg font-semibold text-black">{title}</h6>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
        <MdOutlinePushPin
          className={`cursor-pointer transition-transform transform hover:scale-110 ${
            isPinned ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={onPinNote}
        />
      </div>

      <p className="text-sm text-black mt-2 mb-4 leading-snug">
        {content?.slice(0, 80)}{content?.length > 80 && "..."}
      </p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs font-medium text-gray-600">{tags}</div>
        <div className="flex items-center gap-3">
          <MdCreate
            className="cursor-pointer text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-transform"
            onClick={onEdit}
          />
          <MdDelete
            className="cursor-pointer text-red-600 hover:text-red-800 transform hover:scale-110 transition-transform"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
